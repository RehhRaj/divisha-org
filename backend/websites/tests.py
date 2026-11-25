from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.test import Client, TestCase

from kernel.models import AuditEvent
from tenancy.models import BusinessType, Tenant

from .models import Website


class StageTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command("seed_stage", verbosity=0)
        cls.users = get_user_model().objects

    def sign_in(self, username):
        self.client.force_login(self.users.get(username=username))

    def page(self, slug):
        return self.client.get("/api/page/", {"host": f"{slug}.localhost:3000"})

    def test_seed_is_repeatable_and_public_routes_are_isolated(self):
        call_command("seed_stage", verbosity=0)
        self.assertEqual(BusinessType.objects.count(), 2)
        self.assertEqual(Tenant.objects.count(), 4)
        self.assertEqual(self.users.count(), 5)
        for slug, title in [
            ("jeetu-restau", "Jeetu Da Dhaba"), ("teal-restau", "Teal Restaurant"),
            ("apexacademy-edu", "Apex Academy"), ("horizon-edu", "Horizon Academy"),
        ]:
            self.assertEqual(self.page(slug).json()["title"], title)
        self.assertEqual(self.page("unknown").status_code, 404)
        Tenant.objects.filter(slug="jeetu-restau").update(active=False)
        self.assertEqual(self.page("jeetu-restau").status_code, 404)

    def test_cross_tenant_read_and_write_are_denied(self):
        self.sign_in("jeetu_restau_admin")
        self.assertContains(self.client.get("/panel/"), "Jeetu Da Dhaba")
        self.assertNotContains(self.client.get("/panel/"), "Teal Restaurant")
        url = "/panel/t/teal-restau/"
        self.assertEqual(self.client.get(url).status_code, 404)
        self.assertEqual(self.client.post(url, {"action": "publish"}).status_code, 404)
        self.assertEqual(self.client.post(url, {
            "action": "save", "draft_title": "Changed", "draft_description": "Changed",
        }).status_code, 404)
        self.assertFalse(AuditEvent.objects.exists())

    def test_editor_saves_draft_but_cannot_publish(self):
        self.sign_in("teal_restau_admin")
        url = "/panel/t/teal-restau/"
        self.assertEqual(self.client.post(url, {
            "action": "save", "draft_title": "New Draft", "draft_description": "New text",
        }).status_code, 302)
        self.assertEqual(Website.objects.get(tenant__slug="teal-restau").draft_title, "New Draft")
        self.assertEqual(self.page("teal-restau").json()["title"], "Teal Restaurant")
        self.assertEqual(self.client.post(url, {"action": "publish"}).status_code, 403)

    def test_reviewer_can_publish_but_cannot_edit(self):
        self.sign_in("horizon_edu_admin")
        url = "/panel/t/horizon-edu/"
        self.assertEqual(self.client.post(url, {
            "action": "save", "draft_title": "Changed", "draft_description": "Changed",
        }).status_code, 403)
        self.assertEqual(self.client.post(url, {"action": "publish"}).status_code, 302)
        self.assertEqual(AuditEvent.objects.get().action, "website.publish")

    def test_owner_publishes_and_request_id_matches_audit(self):
        self.sign_in("jeetu_restau_admin")
        url = "/panel/t/jeetu-restau/"
        self.assertEqual(self.client.post(url, {
            "action": "save", "draft_title": "New title", "draft_description": "New text",
        }).status_code, 302)
        response = self.client.post(url, {"action": "publish"})
        self.assertEqual(str(AuditEvent.objects.get(action="website.publish").request_id),
                         response.headers["X-Request-ID"])
        self.assertEqual(self.page("jeetu-restau").json()["title"], "New title")

    def test_offerings_and_contact_keep_the_previous_snapshot_until_publish(self):
        self.sign_in("jeetu_restau_admin")
        panel = "/panel/t/jeetu-restau/"
        draft = {
            "action": "save",
            "draft_title": "Jeetu Da Dhaba",
            "draft_description": "Local restaurant",
            "draft_offerings": "Paneer Tikka | ₹240",
            "draft_hours": "Mon–Sat, 12–9 pm",
            "draft_contact": "Contact the restaurant for reservations",
        }
        self.assertEqual(self.client.post(panel, draft).status_code, 302)
        self.assertEqual(self.page("jeetu-restau").json()["offerings"], [])
        self.assertEqual(self.client.post(panel, {"action": "publish"}).status_code, 302)
        page = self.page("jeetu-restau").json()
        self.assertEqual(page["offerings"], [{"name": "Paneer Tikka", "detail": "₹240"}])
        self.assertEqual(page["hours"], draft["draft_hours"])
        self.assertEqual(page["contact"], draft["draft_contact"])
        self.assertEqual(self.page("teal-restau").json()["offerings"], [])

        draft["draft_offerings"] = "Paneer Tikka | ₹260"
        self.assertEqual(self.client.post(panel, draft).status_code, 302)
        self.assertEqual(self.page("jeetu-restau").json()["offerings"], page["offerings"])
        self.assertEqual(self.client.post(panel, {"action": "publish"}).status_code, 302)
        self.assertEqual(self.page("jeetu-restau").json()["offerings"][0]["detail"], "₹260")

    def test_panel_requires_login_and_csrf(self):
        url = "/panel/t/jeetu-restau/"
        self.assertRedirects(self.client.get(url), f"/panel/login/?next={url}")
        client = Client(enforce_csrf_checks=True)
        client.force_login(self.users.get(username="jeetu_restau_admin"))
        self.assertEqual(client.post(url, {"action": "publish"}).status_code, 403)

    def test_platform_admin_is_separate(self):
        self.sign_in("jeetu_restau_admin")
        self.assertEqual(self.client.get("/platform-admin/").status_code, 302)
        operator = self.users.create_superuser(username="platform_admin", password=None)
        self.client.force_login(operator)
        self.assertContains(self.client.get("/platform-admin/"), "Divisha Platform Admin")
        self.assertEqual(self.client.get("/panel/t/jeetu-restau/").status_code, 404)

    def test_platform_support_can_view_but_cannot_write_or_manage_users(self):
        self.sign_in("platform_support")
        base = "/platform-admin/tenancy/tenant/"
        tenant = Tenant.objects.get(slug="jeetu-restau")
        self.assertContains(self.client.get(base), "Jeetu Da Dhaba")
        self.assertEqual(self.client.post(f"{base}{tenant.pk}/change/", {}).status_code, 403)
        self.assertEqual(self.client.get(f"{base}add/").status_code, 403)
        self.assertEqual(self.client.get("/platform-admin/auth/user/").status_code, 403)


class TemplatePilotTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command("seed_landings", verbosity=0)
        call_command("seed_template_pilot", verbosity=0)

    def test_seed_is_repeatable_and_offers_five_choices_per_type(self):
        from .management.commands.seed_template_pilot import PILOT
        from .registry import template_choices

        call_command("seed_template_pilot", verbosity=0)
        self.assertEqual(Tenant.objects.count(), 9)
        self.assertEqual(get_user_model().objects.count(), 9)
        for business_type, _, sites in PILOT:
            self.assertEqual(len(template_choices(business_type)), 5)
            landing = self.client.get("/api/page/", {"host": f"{business_type}.localhost:3000"})
            self.assertEqual(landing.json()["page_type"], "business_landing")
            keys = set()
            for slug, _, key, _ in sites:
                page = self.client.get("/api/page/", {"host": f"{slug}.localhost:3000"})
                self.assertEqual(page.status_code, 200)
                self.assertEqual(page.json()["template"], key)
                self.assertIn("layout", page.json()["presentation"])
                keys.add(key)
            self.assertEqual(len(keys), 3)

    def test_template_selection_is_scoped_and_requires_publish(self):
        slug = "pilot-tandoor-restau"
        user = get_user_model().objects.get(username="pilot_tandoor_restau_admin")
        self.client.force_login(user)
        panel = f"/panel/t/{slug}/"
        hostname = {"host": f"{slug}.localhost:3000"}
        draft = {"action": "save", "draft_title": "Tandoor House", "draft_description": "New menu"}
        wrong_type = self.client.post(panel, {**draft, "template": "tour-adventure"})
        self.assertContains(wrong_type, "Select a valid choice")
        self.assertEqual(self.client.get("/api/page/", hostname).json()["template"], "restaurant-classic")
        self.assertEqual(
            self.client.post(panel, {**draft, "template": "restaurant-night"}).status_code, 302,
        )
        self.assertEqual(self.client.get("/api/page/", hostname).json()["template"], "restaurant-classic")
        self.assertEqual(self.client.post(panel, {"action": "publish"}).status_code, 302)
        self.assertEqual(self.client.get("/api/page/", hostname).json()["template"], "restaurant-night")
        self.assertEqual(self.client.get("/panel/t/pilot-wild-tour/").status_code, 404)

    def test_programmes_and_timcy_packages_publish_independently(self):
        from tenancy.models import Domain

        timcy = Tenant.objects.get(slug="pilot-wild-tour")
        Domain.objects.create(tenant=timcy, hostname="timcy-tour.divisha.org")
        for slug, host, entry, variant in (
            ("pilot-river-edu", "pilot-river-edu.localhost", "Admissions | Opens 1 August", "education-admissions"),
            ("pilot-wild-tour", "timcy-tour.divisha.org", "Weekend trek | 2 days", "tour-adventure"),
        ):
            with self.subTest(slug=slug):
                self.client.force_login(get_user_model().objects.get(username=slug.replace("-", "_") + "_admin"))
                panel = f"/panel/t/{slug}/"
                query = {"host": host}
                self.assertEqual(self.client.post(panel, {
                    "action": "save",
                    "draft_title": "Updated site",
                    "draft_description": "Updated description",
                    "draft_offerings": entry,
                }).status_code, 302)
                self.assertEqual(self.client.get("/api/page/", query).json()["offerings"], [])
                self.assertEqual(self.client.post(panel, {"action": "publish"}).status_code, 302)
                name, detail = entry.split(" | ")
                page = self.client.get("/api/page/", query).json()
                self.assertEqual(page["offerings"], [{"name": name, "detail": detail}])
                self.assertEqual(page["template"], variant)

        landing = self.client.get("/api/page/", {"host": "tour.divisha.org"}).json()
        self.assertEqual(landing["page_type"], "business_landing")

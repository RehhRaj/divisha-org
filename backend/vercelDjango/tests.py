from django.test import SimpleTestCase


class TenantCatalogTests(SimpleTestCase):
    variants = {
        "teal-restau": "fine-dining",
        "jeetu-restau": "dhaba",
        "abc-restau": "classic",
        "abc-tour": "adventure",
        "jeetu-tour": "classic",
        "apexacademy-tour": "luxury",
    }

    def page(self, host, **query):
        return self.client.get("/api/page/", {"host": host, **query})

    def test_hardcoded_tenant_catalogs_have_distinct_items_and_images(self):
        titles = set()
        images = set()
        for host, variant in self.variants.items():
            local = self.page(f"{host}.localhost:3000")
            production = self.page(f"{host}.divisha.org")
            self.assertEqual(local.status_code, 200)
            self.assertEqual(local.json(), production.json())
            self.assertEqual(local.json()["template_variant"], variant)
            items = local.json()["items"]
            self.assertEqual(len(items), 5)
            titles.update(item["title"] for item in items)
            images.update(item["image_url"] for item in items)
        self.assertEqual(len(titles), 30)
        self.assertEqual(len(images), 30)

    def test_preview_does_not_change_tenant_catalog(self):
        self.assertEqual(
            self.page("localhost", showcase="restau", variant="dhaba").json()["template_variant"],
            "dhaba",
        )
        teal = self.page("teal-restau.localhost").json()
        self.assertEqual(teal["template_variant"], "fine-dining")
        self.assertEqual(teal["items"][0]["title"], "Teal Signature Beetroot Carpaccio")

    def test_existing_and_new_routes(self):
        self.assertEqual(self.page("divisha.org").json()["page_type"], "platform")
        self.assertEqual(self.page("tour.divisha.org").json()["page_type"], "demo")
        self.assertEqual(self.page("abc-society.divisha.org").json()["page_type"], "tenant")
        self.assertEqual(self.page("localhost", showcase="restau", variant="dhaba").json()["template_variant"], "dhaba")
        self.assertIn("steps", self.page("localhost", demo="society").json())
        self.assertEqual(self.page("jeetu-tour.localhost", variant="luxury").status_code, 404)
        self.assertEqual(self.page("unknown-tour.localhost").status_code, 404)
        self.assertEqual(self.client.get("/api/health/").json(), {"status": "ok"})
        self.assertEqual(self.client.get("/admin/").status_code, 302)


class PosDemoConfigTests(SimpleTestCase):
    def test_local_demo_is_read_only_and_tenant_scoped(self):
        endpoint = "/api/pos/demo-config/"
        with self.settings(DEBUG=True):
            jeetu = self.client.get(endpoint, {"host": "jeetu-restau.localhost:3000"})
            pilot = self.client.get(endpoint, {"host": "pilot-restau.localhost:3000"})
            self.assertEqual(jeetu.json()["menu"][0]["price_paise"], 2500)
            self.assertEqual(pilot.json()["tenant"], "pilot-restau")
            self.assertIn("no-store", jeetu.headers["Cache-Control"])
            for host in ("teal-restau.localhost", "jeetu-tour.localhost", "unknown-restau.localhost", "jeetu-restau.divisha.org"):
                with self.subTest(host=host):
                    self.assertEqual(self.client.get(endpoint, {"host": host}).status_code, 404)
            self.assertEqual(self.client.get(endpoint, {"host": "jeetu-restau.localhost"}, REMOTE_ADDR="192.0.2.1").status_code, 404)
            self.assertEqual(self.client.post(endpoint + "?host=jeetu-restau.localhost").status_code, 405)
        self.assertEqual(self.client.get(endpoint, {"host": "jeetu-restau.localhost"}).status_code, 404)


class RestaurantCheckoutTests(SimpleTestCase):
    def test_order_context_is_scoped_to_site_and_table(self):
        from unittest.mock import patch

        # with patch.dict("os.environ", {"JEETU_ORDER_WHATSAPP": "919000000000"}):
        with patch.dict("os.environ", {"JEETU_ORDER_WHATSAPP": "919810014587"}):
            checkout = self.client.get("/api/page/", {
                "host": "jeetu-restau.localhost",
                "table": "demo-table-07",
            }).json()
            self.assertEqual(checkout["site_id"], "jeetu-restau")
            self.assertEqual(checkout["ordering"], {
                "whatsapp_number": "919000000000",
                "mode": "dine-in",
                "table": {"id": "07", "label": "Table 07"},
            })
            invalid = self.client.get("/api/page/", {
                "host": "jeetu-restau.localhost", "table": "unknown",
            }).json()
            self.assertEqual(invalid["ordering"]["mode"], "invalid-table")
            takeaway = self.client.get("/api/page/", {"host": "jeetu-restau.localhost"}).json()
            self.assertEqual(takeaway["ordering"]["mode"], "takeaway")
            teal = self.client.get("/api/page/", {
                "host": "teal-restau.localhost", "table": "demo-table-07",
            }).json()
            self.assertIsNone(teal["ordering"])

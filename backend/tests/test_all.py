import json
import os
import tempfile
import unittest
from decimal import Decimal
from pathlib import Path

from config import settings
from core import api, resolver
from core.contracts import BusinessType, ConfigError, ModuleSpec, TemplateSpec
from core.registry import Registry, load_registry
from business_types.hospital.logic import generate_patient_code
from business_types.restaurant.logic import bill_total
from business_types.school.logic import grade_for

ROOT = "localhost"


def real_registry():
    return load_registry(settings.ENABLED_BUSINESS_TYPES, settings.TENANTS_FILE)


def row(**over):
    base = {"slug": "x", "name": "x", "business_type": "school", "template": "school-template-a",
            "custom_domain": "x.com", "contact": "1", "status": "active"}
    base.update(over)
    return base


def registry_with(rows, reload_on_change=False):
    """Registry over the real business types and a temp tenants file."""
    d = tempfile.mkdtemp()
    p = Path(d) / "tenants.json"
    p.write_text(json.dumps({"tenants": rows}))
    types = [__import__(m, fromlist=["BUSINESS_TYPE"]).BUSINESS_TYPE for m in settings.ENABLED_BUSINESS_TYPES]
    return Registry(types, p, reload_on_change), p


class ContractTests(unittest.TestCase):
    def make(self, **over):
        args = dict(
            key="gym", name="Gym", modules=(ModuleSpec("members", "Members"),),
            templates=(TemplateSpec("gym-a", "Gym A", "cards", {"primary": "#000"}, ("members",)),),
            greeting=lambda n: n,
        )
        args.update(over)
        return BusinessType(**args)

    def test_valid(self):
        self.assertEqual(self.make().key, "gym")

    def test_template_with_unknown_module(self):
        bad = (TemplateSpec("gym-a", "A", "cards", {"primary": "#000"}, ("nope",)),)
        with self.assertRaises(ConfigError):
            self.make(templates=bad)

    def test_template_needs_primary_color(self):
        bad = (TemplateSpec("gym-a", "A", "cards", {}, ("members",)),)
        with self.assertRaises(ConfigError):
            self.make(templates=bad)

    def test_needs_template(self):
        with self.assertRaises(ConfigError):
            self.make(templates=())


class RegistryTests(unittest.TestCase):
    def test_dummy_data_loads(self):
        reg = real_registry()
        self.assertEqual([t.slug for t in reg.tenants()], ["abc", "hsbc", "ss-school", "norw"])
        self.assertEqual({b.key for b in reg.business_types()}, {"school", "hospital", "restaurant"})

    def test_template_of_other_business_type_rejected(self):
        with self.assertRaises(ConfigError):
            registry_with([row(template="hos-template-a")])

    def test_unknown_template_unknown_type_bad_status_duplicates(self):
        for bad in (row(template="nope"), row(business_type="gym"), row(status="weird"), row(slug="Bad Slug!")):
            with self.assertRaises(ConfigError):
                registry_with([bad])
        with self.assertRaises(ConfigError):
            registry_with([row(), row(slug="y")])  # same custom domain
        with self.assertRaises(ConfigError):
            registry_with([row(custom_domain="a.com"), row(custom_domain="b.com")])  # same slug and type

    def test_same_slug_allowed_in_different_business_types(self):
        reg, _ = registry_with([row(), row(business_type="hospital", template="hos-template-a", custom_domain="y.com")])
        self.assertIsNotNone(reg.find_tenant("school", "x"))
        self.assertIsNotNone(reg.find_tenant("hospital", "x"))

    def test_domain_lookup_is_normalized(self):
        reg = real_registry()
        for host in ("abc.com", "ABC.com:3000", "www.abc.com", "https://abc.com/path"):
            self.assertEqual(reg.find_tenant_by_domain(host).slug, "abc")

    def test_file_reload_in_debug(self):
        reg, path = registry_with([row()], reload_on_change=True)
        self.assertEqual(len(reg.tenants()), 1)
        path.write_text(json.dumps({"tenants": [row(), row(slug="z", custom_domain="z.com")]}))
        os.utime(path, (1, 99999999))  # force a different mtime
        self.assertEqual(len(reg.tenants()), 2)
        path.write_text("{ broken")
        os.utime(path, (1, 199999999))
        with self.assertLogs("core.registry", level="ERROR"):
            self.assertEqual(len(reg.tenants()), 2)  # keeps last good data


class ResolverTests(unittest.TestCase):
    def setUp(self):
        self.reg = real_registry()

    def r(self, host):
        return resolver.resolve(host, ROOT, self.reg)

    def test_platform(self):
        self.assertEqual(self.r("localhost:3000").level, resolver.PLATFORM)
        self.assertEqual(self.r("www.localhost").level, resolver.PLATFORM)

    def test_business_type_default_view(self):
        res = self.r("school.localhost:3000")
        self.assertEqual((res.level, res.business_type), (resolver.BUSINESS_TYPE, "school"))
        self.assertEqual(self.r("restaurant.localhost").level, resolver.BUSINESS_TYPE)

    def test_unregistered_business_type_is_unknown(self):
        self.assertEqual(self.r("gym.localhost").level, resolver.UNKNOWN)

    def test_tenant_by_subdomain(self):
        res = self.r("abc.school.localhost:3000")
        self.assertEqual((res.level, res.business_type, res.tenant), (resolver.TENANT, "school", "abc"))
        self.assertEqual(self.r("ss-school.school.localhost").tenant, "ss-school")

    def test_unknown_tenant_or_wrong_business_type(self):
        self.assertEqual(self.r("dps.school.localhost").level, resolver.UNKNOWN)
        self.assertEqual(self.r("abc.hospital.localhost").level, resolver.UNKNOWN)
        self.assertEqual(self.r("a.b.c.localhost").level, resolver.UNKNOWN)

    def test_tenant_by_custom_domain(self):
        res = self.r("abc.com:3000")
        self.assertEqual((res.level, res.business_type, res.tenant), (resolver.TENANT, "school", "abc"))
        self.assertEqual(self.r("norw.com").business_type, "hospital")

    def test_foreign_host(self):
        self.assertEqual(self.r("evil.com").level, resolver.UNKNOWN)


class ApiTests(unittest.TestCase):
    def setUp(self):
        self.reg = real_registry()

    def get(self, host):
        return api.build_message(self.reg, host, ROOT)

    def test_platform_and_business_type(self):
        self.assertEqual(self.get("localhost")[1]["message"], "Welcome to the Business OS platform.")
        status, body = self.get("school.localhost")
        self.assertEqual(status, 200)
        self.assertIn("school", body["message"])
        self.assertIsNone(body["template"])

    def test_school_tenant_a(self):
        status, body = self.get("abc.com")
        self.assertEqual(status, 200)
        self.assertEqual(body["message"], "Welcome to abc · School Portal")
        self.assertEqual(body["template"]["key"], "school-template-a")
        self.assertEqual(body["template"]["layout"], "sidebar")
        self.assertEqual([m["label"] for m in body["template"]["modules"]],
                         ["Students", "Attendance", "Fees", "Exams"])
        self.assertEqual(body["contact"], "123456789")

    def test_same_business_type_different_template(self):
        body = self.get("ss.com")[1]
        self.assertEqual(body["template"]["key"], "school-template-b")
        self.assertEqual(body["template"]["layout"], "cards")
        self.assertEqual(len(body["template"]["modules"]), 6)
        self.assertEqual(body["tenant_name"], "ss school")

    def test_hospital_and_subdomain_give_same_result(self):
        by_domain = self.get("norw.com")[1]
        by_subdomain = self.get("norw.hospital.localhost")[1]
        self.assertEqual(by_domain["template"], by_subdomain["template"])
        self.assertEqual(by_domain["template"]["key"], "hos-template-a")
        self.assertIn("Hospital Management", by_domain["message"])

    def test_pending_tenant_blocked_without_template_or_contact(self):
        status, body = self.get("hscb.com")
        self.assertEqual(status, 403)
        self.assertEqual(body["status"], "pending")
        self.assertIsNone(body["template"])
        self.assertIsNone(body["contact"])
        self.assertIn("not active", body["message"])

    def test_unknown(self):
        status, body = self.get("unknown.com")
        self.assertEqual((status, body["level"]), (404, "unknown"))

    def test_response_keeps_old_keys(self):
        body = self.get("abc.com")[1]
        for key in ("message", "level", "business_type", "tenant", "host"):
            self.assertIn(key, body)


class BusinessLogicTests(unittest.TestCase):
    def test_school_grading_follows_template_option(self):
        self.assertEqual(grade_for(92, {"grading": "letter"}), "A+")
        self.assertEqual(grade_for(45, {"grading": "letter"}), "F")
        self.assertEqual(grade_for(95, {"grading": "cgpa10"}), Decimal("10.0"))

    def test_hospital_patient_code(self):
        self.assertEqual(generate_patient_code(42, {"patient_code_prefix": "HOS"}), "HOS-000042")

    def test_restaurant_bill(self):
        result = bill_total([("100.00", 2), ("50.00", 1)], {"tax_rate": "0.05", "service_charge": "0.00"})
        self.assertEqual(result["total"], Decimal("262.50"))

    def test_core_does_not_import_business_types(self):
        import re
        pattern = re.compile(r"^\s*(from|import)\s+business_types", re.M)
        for f in Path(__file__).resolve().parent.parent.joinpath("core").glob("*.py"):
            self.assertIsNone(pattern.search(f.read_text()), f"{f.name} must not import business_types")


if __name__ == "__main__":
    unittest.main()

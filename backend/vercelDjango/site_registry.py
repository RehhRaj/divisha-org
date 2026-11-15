from .template_config import RESTAURANT_TEMPLATE

BASE_DOMAIN = "divisha.org"
BUSINESS_TYPES = {
    "tour": {"title": "Tour Business Demo", "message": "Welcome to Tour Business Demo", "template": "tour"},
    "restau": {"title": "Restaurant Business Demo", "message": "Welcome to Restaurant Demo", "template": "restaurant"},
    "society": {"title": "Society Business Demo", "message": "Welcome to Society Demo", "template": "society"},
    "edu": {"title": "Education & School Demo", "message": "Welcome to School Management Demo", "template": "education"},
    "salon": {"title": "Beauty & Salon Demo", "message": "Welcome to Beauty & Care Salon Demo", "template": "salon"},
}
RESERVED_TENANT_SLUGS = {"www", "api", "admin", "app", "dashboard", "login", "register", "support"} | set(BUSINESS_TYPES)
TENANTS = {
    "jeetu": "Jeetu",
    "teal": "Teal",
    "pilot": "Pilot Kitchen",
    "abc": "ABC",
    "apexacademy": "Apex International Academy",
    "glamhub": "Glam Hub",
}
# List of records makes duplicate composite keys detectable before indexing.
BUSINESS_SITE_RECORDS = [
    {"tenant": "jeetu", "business_type": "tour", "title": "Jeetu newwwwwwww Tour Business", "message": "Welcome to Jeetu Tour Website"},
    
    
        {
        "tenant": "jeetu",
        "business_type": "restau",
        "title": "Jeetu Da Dhaba & Restaurant",
        "message": "Welcome to Jeetu Fine Dine Restaurant",
        "features": {"website": True, "restaurant_pos": True},
        "template_variant": "dhaba",
        "brand_colors": {"primary": "#0d8f34"},
        "ordering": {
            "whatsapp_env": "JEETU_ORDER_WHATSAPP",
            "whatsapp_number": "919911112823",


            "tables": {
    "01-u1klwd70u4": {"id": "01", "label": "Table 01"},
    "02-2r16cq0dpx": {"id": "02", "label": "Table 02"},
    "03-x9dwezi5my": {"id": "03", "label": "Table 03"},
    "04-vhx7eyhvw7": {"id": "04", "label": "Table 04"},
    "05-mwdmu8ddbm": {"id": "05", "label": "Table 05"},
    "06-cd22jebpea": {"id": "06", "label": "Table 06"},
    "07-uj80rl6mac": {"id": "07", "label": "Table 07"},
    "08-biiu4yjryk": {"id": "08", "label": "Table 08"},
    "09-g7ll9fktg4": {"id": "09", "label": "Table 09"},
    "10-zdt2bonok9": {"id": "10", "label": "Table 10"},

    # Purana Table 07 test link bhi chalta rahega.
    "demo-table-07": {"id": "07", "label": "Table 07"},
},
        },
    },
    
    
    {"tenant": "jeetu", "business_type": "salon", "title": "Jeetu Gents Salon", "message": "Welcome to Jeetu Grooming Station"},
    {"tenant": "pilot", "business_type": "restau", "features": {"website": False, "restaurant_pos": True}, "title": "Pilot Kitchen", "message": "Restaurant POS demo"},
    
        {
        "tenant": "teal",
        "business_type": "restau",
        "title": "Teal Restaurant",
        "message": "Welcome to Teal Restaurant",
        "template_variant": "fine-dining",
    },
    
    {"tenant": "abc", "business_type": "society", "title": "ABC Co-operative Society", "message": "Welcome to ABC Residential Society Portal"},
    {"tenant": "abc", "business_type": "tour", "title": "ABC Tour & Travels", "message": "Welcome to ABC Tour Website"},
    {"tenant": "abc", "business_type": "restau", "title": "ABC Multi-Cuisine Restaurant", "message": "Welcome to ABC Restaurant Website"},
    {"tenant": "apexacademy", "business_type": "edu", "title": "Apex International Academy", "message": "Welcome to Apex Academy Portal"},
    {"tenant": "apexacademy", "business_type": "tour", "title": "Apex Educational Tours", "message": "Welcome to Apex Academy Study Tours & Travels"},
    {"tenant": "glamhub", "business_type": "salon", "title": "Glam Hub Luxury Salon", "message": "Welcome to Glam Hub Styling Studio"},
]
# Examples only: add a custom domain after verifying ownership and configuring Vercel DNS/TLS.
CUSTOM_DOMAINS = {}

TEMPLATE_VARIANTS = {
    "tour": ("classic", "adventure", "luxury"),
    "restau": tuple(RESTAURANT_TEMPLATE["variants"]),
    "society": ("classic", "resident-portal", "premium-community"),
    "edu": ("classic", "admissions", "campus"),
    "salon": ("classic", "grooming", "luxury"),
}



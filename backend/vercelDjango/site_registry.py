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
    "abc": "ABC",
    "apexacademy": "Apex International Academy",
    "glamhub": "Glam Hub",
}
# List of records makes duplicate composite keys detectable before indexing.
BUSINESS_SITE_RECORDS = [
    {"tenant": "jeetu", "business_type": "tour", "title": "Jeetu newwwwwwww Tour Business", "message": "Welcome to Jeetu Tour Website"},
    {"tenant": "jeetu", "business_type": "restau", "title": "Jeetu Da Dhaba & Restaurant", "message": "Welcome to Jeetu Fine Dine Restaurant"},
    {"tenant": "jeetu", "business_type": "salon", "title": "Jeetu Gents Salon", "message": "Welcome to Jeetu Grooming Station"},
    {"tenant": "teal", "business_type": "restau", "title": "Teal Restaurant", "message": "Welcome to Teal Restaurant"},
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
    "restau": ("classic", "dhaba", "fine-dining"),
    "society": ("classic", "resident-portal", "premium-community"),
    "edu": ("classic", "admissions", "campus"),
    "salon": ("classic", "grooming", "luxury"),
}

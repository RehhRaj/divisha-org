
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
    {"tenant": "jeetu", "business_type": "tour", "title": "Jeetu Tour Business", "message": "Welcome to Jeetu Tour Website"},
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





BUSINESS_SITE_RECORDS = [
    {
        # 1. CORE IDENTITY & ROUTING
        "tenant": "jeetu",
        "business_type": "tour",
        "template_variant": "tour_classic",
        "is_active": True,
        "custom_domain": None,
        "currency": "INR",
        "currency_symbol": "₹",

        # 2. BRANDING & THEME
        "theme": {
            "primary_color": "#174d48",
            "secondary_color": "#d9ede4",
            "logo_url": "https://divisha.org",
            "favicon_url": "https://divisha.org"
        },

        # 3. HERO & DYNAMIC CTA CONFIG
        "content": {
            "title": "Jeetu Tour & Travels",
            "tagline": "Your Trusted Himalayan & Coastal Travel Partner",
            "message": "Discover beautiful places and unforgettable experiences with curated family and group tours.",
            "hero_image_url": "https://divisha.org",
            "primary_cta": {
                "text": "Plan a Trip",
                "link": "#contact",           # Kisi site par "#contact", kisi par "/enquiry" ya WhatsApp URL
                "open_in_new_tab": False
            },
            "secondary_cta": {
                "text": "Explore Packages",
                "link": "#destinations",
                "open_in_new_tab": False
            },
            "about_us": "Serving travelers across India since 2015 with customized itineraries and 24/7 support."
        },

        # 4. SECTION VISIBILITY TOGGLES (Bina code change kiye sections on/off karein)
        "sections": {
            "show_highlights": True,
            "show_packages": True,
            "show_why_us": True,
            "show_testimonials": False,      # Agar reviews nahi hain toh section hide rahega
            "show_whatsapp_float": True      # Corner me floating WhatsApp icon
        },

        # 5. LEAD CAPTURE & CONTACT
        "lead_config": {
            "mode": "whatsapp",              # Options: "whatsapp" | "form" | "call"
            "prefilled_message": "Hi, I am interested in your tour package:"
        },
        "contact": {
            "phone": "+91 9876543210",
            "whatsapp": "919876543210",
            "email": "bookings@jeetutours.in",
            "address": "Shop 12, Mall Road, Manali, Himachal Pradesh",
            "gst_or_reg_no": "02ABCDE1234F1Z5"
        },

        # 6. SOCIAL LINKS & TRUST METRICS
        "socials": {
            "instagram": "https://instagram.com",
            "facebook": "https://facebook.com",
            "youtube": ""
        },
        "highlights": [
            {"label": "Happy Travelers", "value": "5,000+"},
            {"label": "Destinations", "value": "45+"},
            {"label": "Experience", "value": "10 Years"}
        ],

        # 7. DYNAMIC OFFERINGS (PACKAGES / MENU / SERVICES)
        "items": [
            {
                "id": "pkg_101",
                "slug": "himalayan-escape",
                "is_featured": True,
                "badge": "Best Seller",
                "title": "Himalayan Escape",
                "subtitle": "Manali · Shimla · Kasol",
                "duration_or_meta": "5 Days / 4 Nights",
                
                # Enhanced Pricing Config
                "price": 12500,
                "discount_price": 10999,
                "price_unit": "per_person",   # Options: "per_person" | "per_couple" | "per_group"
                "price_is_from": True,        # True hone par UI "Starting from ₹10,999" dikhayega
                
                "inclusions": ["3-Star Hotel", "Breakfast & Dinner", "Volvo & Cab"],
                "image_url": "https://divisha.org",
                "description": "Mountain mornings, scenic drives, Volvo transfers and memorable stays.",
                "cta": {
                    "text": "Enquire Now",
                    "link": "#contact"        # Specific package ke liye custom link override
                }
            }
        ],

        # 8. SEO & METADATA
        "seo": {
            "meta_title": "Jeetu Tour & Travels | Best Himachal & Goa Tour Packages",
            "meta_description": "Book affordable family and honeymoon tour packages with Jeetu Tour & Travels.",
            "keywords": ["Manali tour", "Goa package", "Jeetu travels"]
        }



        # 9. TOP OFFER / ANNOUNCEMENT BAR
        "announcement_bar": {
            "is_active": True,
            "text": "🎉 Summer Special: Get up to 15% OFF on Himachal & Kashmir Group Tours!",
            "link": "#destinations"
        },

        # 10. DYNAMIC HEADER & FOOTER NAVIGATION
        "navigation": {
            "header_links": [
                {"label": "Destinations", "href": "#destinations"},
                {"label": "Why Us", "href": "#why-us"},
                {"label": "Reviews", "href": "#testimonials"},
                {"label": "Contact", "href": "#contact"}
            ],
            "footer_links": [
                {"label": "Terms & Conditions", "href": "/terms"},
                {"label": "Cancellation Policy", "href": "/cancellation-policy"}
            ]
        },

        # 11. CUSTOMER TESTIMONIALS (Social Proof)
        "testimonials": [
            {
                "id": "rev_1",
                "customer_name": "Rahul Sharma",
                "location": "Delhi",
                "trip_taken": "Himalayan Escape",
                "rating": 5,
                "comment": "Best family trip experience! Hotels and cab driver were very punctual and polite."
            },
            {
                "id": "rev_2",
                "customer_name": "Sneha Verma",
                "location": "Mumbai",
                "trip_taken": "Coastal Getaway",
                "rating": 5,
                "comment": "Everything was well organized from airport pickup to sightseeing. Highly recommended!"
            }
        ],

        # 12. FREQUENTLY ASKED QUESTIONS (FAQs)
        "faqs": [
            {
                "question": "Are flight or train tickets included in the package price?",
                "answer": "Standard packages include hotel, meals, and local sightseeing cabs. Flights/trains can be added on request."
            },
            {
                "question": "Can we customize the itinerary for a private family group?",
                "answer": "Yes, all our packages can be 100% customized according to your travel dates and budget."
            }
        ],

        # 13. MARKETING & ANALYTICS TRACKING
        "tracking": {
            "google_analytics_id": "",       # e.g., "G-XXXXXXXXXX"
            "meta_pixel_id": ""              # e.g., "123456789012345"
        }


    }
]


"""Divisha business demos, tenant sites, and template variant selections."""

BASE_DOMAIN = "divisha.org"

# These slugs define the design catalog. Register a matching Next.js component
# before selecting a new variant for a demo or tenant site.
BUSINESS_TYPES = {
    "tour": {
        "title": "Tour Business Demo",
        "message": "Welcome to Tour Business Demo",
        "template": "tour",
        "default_template_variant": "classic",
        "template_variants": ("classic", "adventure", "luxury"),
    },
    "restau": {
        "title": "Restaurant Business Demo",
        "message": "Welcome to Restaurant Demo",
        "template": "restaurant",
        "default_template_variant": "classic",
        "template_variants": ("classic", "dhaba", "fine-dining"),
    },
    "society": {
        "title": "Society Business Demo",
        "message": "Welcome to Society Demo",
        "template": "society",
        "default_template_variant": "classic",
        "template_variants": ("classic", "resident-portal", "premium-community"),
    },
    "edu": {
        "title": "Education & School Demo",
        "message": "Welcome to School Management Demo",
        "template": "education",
        "default_template_variant": "classic",
        "template_variants": ("classic", "admissions", "campus"),
    },
    "salon": {
        "title": "Beauty & Salon Demo",
        "message": "Welcome to Beauty & Care Salon Demo",
        "template": "salon",
        "default_template_variant": "classic",
        "template_variants": ("classic", "grooming", "luxury"),
    },
}

RESERVED_TENANT_SLUGS = {
    "www", "api", "admin", "app", "dashboard", "login", "register", "support",
} | set(BUSINESS_TYPES)

TENANTS = {
    "jeetu": "Jeetu",
    "teal": "Teal",
    "abc": "ABC",
    "apexacademy": "Apex International Academy",
    "glamhub": "Glam Hub",
}

JEETU_TOUR_CONTENT = {
    "title": "Jeetu Tour & Travels",
    "tagline": "Explore Himalayan and Coastal Getaways",
    "message": "Discover curated family and group tours across India.",
    "hero_image_url": None,
    "cta_text": "Plan a Trip",
    "cta_href": "#contact",
    "about_us": "Explore sample itineraries for mountain and coastal holidays.",
    "items_disclaimer": "Sample itineraries and prices for demonstration.",
}

# Keeping records in a list lets the existing index builder detect duplicates.
# A site inherits its business type's default unless it sets template_variant.
BUSINESS_SITE_RECORDS = [
    {
        "tenant": "jeetu",
        "business_type": "tour",
        # Keep these fields available to the existing page resolver.
        "title": JEETU_TOUR_CONTENT["title"],
        "message": JEETU_TOUR_CONTENT["message"],
        "template_variant": "classic",
        "is_active": True,
        "currency": "INR",
        "theme": {
            "primary_color": "#174d48",
            "secondary_color": "#d9ede4",
            "logo_url": None,
            "favicon_url": None,
        },
        "content": JEETU_TOUR_CONTENT,
        "contact": {
            "phone": None,
            "whatsapp": None,
            "email": None,
            "address": None,
            "map_embed_url": None,
        },
        "socials": {
            "instagram": None,
            "facebook": None,
            "youtube": None,
        },
        "highlights": [],
        # Sample offers. Render content.items_disclaimer alongside these cards.
        "items": [
            {
                "id": "pkg_101",
                "is_featured": True,
                "badge": None,
                "title": "Himalayan Escape",
                "subtitle": "Manali · Shimla · Kasol",
                "duration_label": "5 Days / 4 Nights",
                "price": 12500,
                "discount_price": 10999,
                "price_unit": "per_person",
                "price_is_from": True,
                "image_url": None,
                "description": "Mountain mornings, scenic drives, Volvo transfers and memorable stays.",
            },
            {
                "id": "pkg_102",
                "is_featured": True,
                "badge": None,
                "title": "Coastal Getaway",
                "subtitle": "North & South Goa",
                "duration_label": "4 Days / 3 Nights",
                "price": 9500,
                "discount_price": None,
                "price_unit": "per_person",
                "price_is_from": True,
                "image_url": None,
                "description": "Sunlit beaches, water sports, local flavors and easygoing adventures.",
            },
        ],
        "seo": {
            "meta_title": "Jeetu Tour & Travels | Himachal and Goa Tours",
            "meta_description": "Explore sample tour itineraries for Himachal and Goa.",
            "keywords": ["Manali tour", "Goa package", "Jeetu travels"],
        },
    },
    {
        "tenant": "jeetu",
        "business_type": "restau",
        "title": "Jeetu Da Dhaba & Restaurant",
        "message": "Welcome to Jeetu Fine Dine Restaurant",
    },
    {
        "tenant": "jeetu",
        "business_type": "salon",
        "title": "Jeetu Gents Salon",
        "message": "Welcome to Jeetu Grooming Station",
    },
    {
        "tenant": "teal",
        "business_type": "restau",
        "title": "Teal Restaurant",
        "message": "Welcome to Teal Restaurant",
    },
    {
        "tenant": "abc",
        "business_type": "society",
        "title": "ABC Co-operative Society",
        "message": "Welcome to ABC Residential Society Portal",
    },
    {
        "tenant": "abc",
        "business_type": "tour",
        "title": "ABC Tour & Travels",
        "message": "Welcome to ABC Tour Website",
    },
    {
        "tenant": "abc",
        "business_type": "restau",
        "title": "ABC Multi-Cuisine Restaurant",
        "message": "Welcome to ABC Restaurant Website",
    },
    {
        "tenant": "apexacademy",
        "business_type": "edu",
        "title": "Apex International Academy",
        "message": "Welcome to Apex Academy Portal",
    },
    {
        "tenant": "apexacademy",
        "business_type": "tour",
        "title": "Apex Educational Tours",
        "message": "Welcome to Apex Academy Study Tours & Travels",
    },
    {
        "tenant": "glamhub",
        "business_type": "salon",
        "title": "Glam Hub Luxury Salon",
        "message": "Welcome to Glam Hub Styling Studio",
    },
]

# Add custom domains after verifying ownership and configuring Vercel DNS/TLS.
CUSTOM_DOMAINS = {}


def resolve_template_variant(business_type, site=None):
    """Return the selected variant for a known business demo or tenant site."""
    business = BUSINESS_TYPES[business_type]
    variant = site.get("template_variant") if site is not None else None
    if variant is None:
        variant = business["default_template_variant"]

    if variant not in business["template_variants"]:
        raise ValueError(f"Unknown template variant {variant!r} for {business_type!r}.")

    return variant
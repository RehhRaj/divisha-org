"""Divisha business demos, tenant sites, and template variant selections."""

from copy import deepcopy

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

# Reusable sample data by business type. No sample contact details, reviews,
# registration numbers, or promotional claims are published in these records.
_SAMPLE_PROFILES = {
    "tour": {
        "colors": ("#174d48", "#d9ede4"),
        "tagline": "Explore Himalayan and coastal getaways",
        "about": "Browse sample itineraries for family and group holidays.",
        "section_id": "destinations",
        "section_label": "Destinations",
        "primary_label": "Plan a Trip",
        "secondary_label": "Explore Packages",
        "keywords": ["Manali tour", "Goa package", "family travel"],
        "items": [
            {
                "id": "pkg_101",
                "slug": "himalayan-escape",
                "title": "Himalayan Escape",
                "subtitle": "Manali · Shimla · Kasol",
                "description": "Mountain drives, sightseeing and a stay in the hills.",
                "duration_label": "5 Days / 4 Nights",
                "price": 12500,
                "discount_price": 10999,
                "price_unit": "per_person",
                "price_is_from": True,
                "inclusions": ["Hotel stay", "Breakfast and dinner", "Local transfers"],
                "cta": {"text": "Enquire Now", "link": "#contact", "open_in_new_tab": False},
            },
            {
                "id": "pkg_102",
                "slug": "coastal-getaway",
                "title": "Coastal Getaway",
                "subtitle": "North & South Goa",
                "description": "Beach visits, local food and time to explore Goa at your own pace.",
                "duration_label": "4 Days / 3 Nights",
                "price": 9500,
                "price_unit": "per_person",
                "price_is_from": True,
                "inclusions": ["Hotel stay", "Breakfast", "Local sightseeing"],
            },
        ],
        "faqs": [
            {
                "question": "Are flights included in these examples?",
                "answer": "The sample itineraries cover the inclusions listed on each card.",
            },
        ],
    },
    "restau": {
        "colors": ("#762d21", "#fae9cf"),
        "tagline": "North Indian favourites for the whole table",
        "about": "Explore a sample menu of tandoor dishes, curries and meals.",
        "section_id": "menu",
        "section_label": "Menu",
        "primary_label": "Contact the Restaurant",
        "secondary_label": "View Menu",
        "keywords": ["restaurant", "North Indian food", "sample menu"],
        "items": [
            {
                "id": "menu_101",
                "slug": "paneer-tikka",
                "title": "Paneer Tikka",
                "subtitle": "Tandoor starters",
                "description": "Marinated paneer and peppers served with mint chutney.",
                "category": "starters",
                "is_vegetarian": True,
                "price": 280,
                "price_unit": "per_plate",
            },
            {
                "id": "menu_102",
                "slug": "punjabi-thali",
                "title": "Punjabi Thali",
                "subtitle": "North Indian meal",
                "description": "Dal, seasonal sabzi, roti, rice and a sweet.",
                "category": "meals",
                "is_vegetarian": True,
                "price": 360,
                "price_unit": "per_plate",
            },
        ],
        "faqs": [
            {
                "question": "Does this sample menu include vegetarian dishes?",
                "answer": "Yes. Both dishes shown here are vegetarian examples.",
            },
        ],
    },
    "society": {
        "colors": ("#28465d", "#dcebf1"),
        "tagline": "Resident services in one place",
        "about": "See how a society homepage can present helpdesk and notice board information.",
        "section_id": "services",
        "section_label": "Resident Services",
        "primary_label": "Find the Helpdesk",
        "secondary_label": "View Resident Services",
        "keywords": ["housing society", "resident services", "maintenance helpdesk"],
        "items": [
            {
                "id": "service_101",
                "slug": "maintenance-helpdesk",
                "title": "Maintenance Helpdesk",
                "subtitle": "Resident support",
                "description": "An example entry point for plumbing, electrical and common-area complaints.",
                "category": "maintenance",
            },
            {
                "id": "service_102",
                "slug": "society-notices",
                "title": "Society Notices",
                "subtitle": "Community updates",
                "description": "A sample space for maintenance schedules, meetings and resident announcements.",
                "category": "notices",
            },
        ],
        "faqs": [
            {
                "question": "What kind of issues belong in the maintenance helpdesk?",
                "answer": "Typical examples are plumbing, electrical and common-area maintenance issues.",
            },
        ],
    },
    "edu": {
        "colors": ("#263974", "#e5eafa"),
        "tagline": "A place to learn, explore and grow",
        "about": "Explore sample programmes and campus activities for a school website.",
        "section_id": "programmes",
        "section_label": "Programmes",
        "primary_label": "Admissions Enquiry",
        "secondary_label": "Explore Programmes",
        "keywords": ["school", "admissions", "school programmes"],
        "items": [
            {
                "id": "programme_101",
                "slug": "primary-school",
                "title": "Primary School",
                "subtitle": "Classes I–V",
                "description": "An example programme focused on literacy, numeracy and hands-on learning.",
                "grade_range": "Classes I–V",
            },
            {
                "id": "programme_102",
                "slug": "middle-school",
                "title": "Middle School",
                "subtitle": "Classes VI–VIII",
                "description": "A sample programme with science projects, languages, sport and the arts.",
                "grade_range": "Classes VI–VIII",
            },
        ],
        "faqs": [
            {
                "question": "What programmes are shown in this sample?",
                "answer": "The sample covers primary and middle school programmes.",
            },
        ],
    },
    "salon": {
        "colors": ("#63354f", "#f5e4ee"),
        "tagline": "Hair care and grooming for every day",
        "about": "Browse sample haircut, styling and care services.",
        "section_id": "services",
        "section_label": "Services",
        "primary_label": "Contact the Salon",
        "secondary_label": "Explore Services",
        "keywords": ["salon", "haircut", "hair styling"],
        "items": [
            {
                "id": "salon_101",
                "slug": "haircut-and-styling",
                "title": "Haircut & Styling",
                "subtitle": "Cut and finish",
                "description": "A sample haircut service with consultation and a styled finish.",
                "duration_label": "45 minutes",
                "price": 550,
                "price_unit": "per_service",
            },
            {
                "id": "salon_102",
                "slug": "hair-spa",
                "title": "Hair Spa",
                "subtitle": "Hair care",
                "description": "An example conditioning treatment with a scalp massage.",
                "duration_label": "60 minutes",
                "price": 1100,
                "price_unit": "per_service",
            },
        ],
        "faqs": [
            {
                "question": "How long are the sample appointments?",
                "answer": "The examples range from 45 minutes to one hour.",
            },
        ],
    },
}


def _sample_site(tenant, business_type, title, message):
    """Build an independent sample record for the tenant and business pair."""
    profile = deepcopy(_SAMPLE_PROFILES[business_type])
    primary_color, secondary_color = profile["colors"]
    items_link = f"#{profile['section_id']}"
    primary_cta = {
        "text": profile["primary_label"],
        "link": "#contact",
        "open_in_new_tab": False,
    }
    items = [
        {
            "is_featured": True,
            "badge": None,
            "image_url": None,
            "price": None,
            "discount_price": None,
            "price_unit": None,
            "price_is_from": False,
            **item,
        }
        for item in profile["items"]
    ]
    return {
        "tenant": tenant,
        "business_type": business_type,
        "title": title,
        "message": message,
        "template_variant": BUSINESS_TYPES[business_type]["default_template_variant"],
        "is_active": True,
        "currency": "INR",
        "currency_symbol": "₹",
        "theme": {
            "primary_color": primary_color,
            "secondary_color": secondary_color,
            "logo_url": None,
            "favicon_url": None,
        },
        "content": {
            "title": title,
            "tagline": profile["tagline"],
            "message": message,
            "hero_image_url": None,
            "about_us": profile["about"],
            "primary_cta": primary_cta,
            "secondary_cta": {
                "text": profile["secondary_label"],
                "link": items_link,
                "open_in_new_tab": False,
            },
            "cta_text": primary_cta["text"],
            "cta_href": primary_cta["link"],
            "items_disclaimer": "Sample content and prices for demonstration."
            if any(item["price"] is not None for item in items)
            else "Sample content for demonstration.",
        },
        "sections": {
            "show_highlights": False,
            "show_items": True,
            "show_why_us": True,
            "show_testimonials": False,
            "show_whatsapp_float": False,
        },
        "lead_config": {"mode": None, "prefilled_message": None},
        "contact": {
            "phone": None,
            "whatsapp": None,
            "email": None,
            "address": None,
            "map_embed_url": None,
            "gst_or_reg_no": None,
        },
        "socials": {"instagram": None, "facebook": None, "youtube": None},
        "highlights": [],
        "items": items,
        "seo": {
            "meta_title": f"{title} | {profile['section_label']}",
            "meta_description": profile["about"],
            "keywords": profile["keywords"],
        },
        "announcement_bar": {"is_active": False, "text": None, "link": None},
        "navigation": {
            "header_links": [
                {"label": profile["section_label"], "href": items_link},
                {"label": "Why Us", "href": "#why-us"},
                {"label": "Contact", "href": "#contact"},
            ],
            "footer_links": [],
        },
        "testimonials": [],
        "faqs": profile["faqs"],
        "tracking": {"google_analytics_id": None, "meta_pixel_id": None},
    }


# One list lets the existing index builder detect duplicate tenant/type pairs.
BUSINESS_SITE_RECORDS = [
    _sample_site(
        "jeetu",
        "tour",
        "Jeetu Tour & Travels",
        "Discover curated family and group tours across India.",
    ),
    _sample_site(
        "jeetu",
        "restau",
        "Jeetu Da Dhaba & Restaurant",
        "Welcome to Jeetu Fine Dine Restaurant",
    ),
    _sample_site(
        "jeetu",
        "salon",
        "Jeetu Gents Salon",
        "Welcome to Jeetu Grooming Station",
    ),
    _sample_site(
        "teal",
        "restau",
        "Teal Restaurant",
        "Welcome to Teal Restaurant",
    ),
    _sample_site(
        "abc",
        "society",
        "ABC Co-operative Society",
        "Welcome to ABC Residential Society Portal",
    ),
    _sample_site(
        "abc",
        "tour",
        "ABC Tour & Travels",
        "Welcome to ABC Tour Website",
    ),
    _sample_site(
        "abc",
        "restau",
        "ABC Multi-Cuisine Restaurant",
        "Welcome to ABC Restaurant Website",
    ),
    _sample_site(
        "apexacademy",
        "edu",
        "Apex International Academy",
        "Welcome to Apex Academy Portal",
    ),
    _sample_site(
        "apexacademy",
        "tour",
        "Apex Educational Tours",
        "Welcome to Apex Academy Study Tours & Travels",
    ),
    _sample_site(
        "glamhub",
        "salon",
        "Glam Hub Luxury Salon",
        "Welcome to Glam Hub Styling Studio",
    ),
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
"""Public marketing content by business type. Plan data is illustrative during beta."""

PLATFORM_LANDINGS = {
    "edu": {
        "title": "Divisha Edu",
        "demo_url": "https://apexacademy-edu.divisha.org/",
        "headline": "See your school website before you sign up.",
        "message": (
            "Show parents your programmes, campus life and admissions information. "
            "Divisha manages your website and hosting, and you choose the tools your school needs."
        ),
        "eyebrow": "Managed websites for schools",
        "preview": {
            "src": "https://images.unsplash.com/photo-1580582932707-520aed937b7b?fit=crop&w=1100&h=735&q=82&fm=webp",
            "alt": "Reference photo of an empty classroom with desks and a chalkboard",
            "caption": "Classroom reference photo · Unsplash",
            "label": "Apex International Academy",
        },
        
        "currency": "INR",
        "plans": [
            {"id": "free", "name": "Free", "price": 0, "period": ""},
            {"id": "starter", "name": "Starter", "price": 499, "period": "/ month"},
            {"id": "standard", "name": "Standard", "price": 999, "period": "/ month"},
            {"id": "pro", "name": "Pro", "price": 1999, "period": "/ month"},
        ],
        "features": [
            {"label": "School website and admissions information", "plans": ["free", "starter", "standard", "pro"]},
            {"label": "Custom domain, notices and events", "plans": ["starter", "standard", "pro"]},
            {"label": "Admissions enquiry form and gallery", "plans": ["standard", "pro"]},
            {"label": "Parent portal", "plans": ["pro"], "planned": True},
        ],
        "details_step": "Add your logo, programmes, photos and contact details.",
        "whatsapp_number": None,
    },
    "restau": {
        "title": "Divisha Restaurant",
        "headline": "Give every table a digital menu.",
        "message": (
            "Show guests your menu and let them prepare a takeaway or table order "
            "on WhatsApp. Choose the website tools your restaurant needs."
        ),
        "eyebrow": "Managed websites for restaurants",
        "demo_url": "https://jeetu-restau.divisha.org/",
        "preview": {
            "src": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?fit=crop&w=1100&h=735&q=82&fm=webp",
            "alt": "Reference photo of a restaurant dining room",
            "caption": "Restaurant reference photo · Unsplash",
            "label": "Jeetu Da Dhaba & Restaurant",
        },
        "currency": "INR",
        "plans": [
            {"id": "free", "name": "Free", "price": 0, "period": ""},
            {"id": "menu", "name": "Menu", "price": 399, "period": "/ month"},
            {"id": "ordering", "name": "Ordering", "price": 799, "period": "/ month"},
        ],
        "features": [
            {"label": "Restaurant website and digital menu", "plans": ["free", "menu", "ordering"]},
            {"label": "Custom domain", "plans": ["menu", "ordering"]},
            {"label": "WhatsApp takeaway and QR table ordering", "plans": ["ordering"]},
        ],
        "details_step": "Add your menu, photos and contact details.",
        "whatsapp_number": None,
    },

    "tour": {
        "title": "Divisha Tour",
        "demo_url": "https://abc-tour.divisha.org/",
        "headline": "Show your tour packages online, before you sign up.",
        "message": (
            "Publish destinations, packages and itineraries, "
            "and let travellers enquire on WhatsApp."
        ),
        "eyebrow": "Managed websites for tour operators",
        
        "preview": {
            "src": "https://images.unsplash.com/photo-1654815801625-459866418f60?fit=crop&w=1100&h=735&q=82&fm=webp",
            "alt": "Reference photo for tour packages",
            "caption": "Travel reference photo · Unsplash",
            "label": "ABC Tour & Travels",
        },

        "currency": "INR",
        "plans": [
            {"id": "free", "name": "Free", "price": 0, "period": ""},
            {"id": "starter", "name": "Starter", "price": 499, "period": "/ month"},
            {"id": "pro", "name": "Pro", "price": 999, "period": "/ month"},
        ],
        "features": [
            {"label": "Tour website and package pages", "plans": ["free", "starter", "pro"]},
            {"label": "Custom domain", "plans": ["starter", "pro"]},
            {"label": "WhatsApp enquiry button", "plans": ["starter", "pro"]},
            {"label": "Online enquiry form", "plans": ["pro"], "planned": True},
        ],
        "details_step": "Add your packages, photos and contact details.",
        "whatsapp_number": None,
    },
    "society": {
        "title": "Divisha Society",
        "demo_url": "https://abc-society.divisha.org/",
        "headline": "A clearer way to run your housing society.",
        "message": "Notices, resident services and a simple path for maintenance requests.",
        "eyebrow": "Managed websites for societies",

        "preview": {
            "src": "https://images.unsplash.com/photo-1654815801625-459866418f60?fit=crop&w=1100&h=735&q=82&fm=webp",
            "alt": "Reference photo for a housing society",
            "caption": "Society reference photo · Unsplash",
            "label": "ABC Co-operative Society",
        },

        "currency": "INR",
        "plans": [
            {"id": "free", "name": "Free", "price": 0, "period": ""},
            {"id": "standard", "name": "Standard", "price": 599, "period": "/ month"},
            {"id": "pro", "name": "Pro", "price": 1499, "period": "/ month"},
        ],
        "features": [
            {"label": "Society website and resident services", "plans": ["free", "standard", "pro"]},
            {"label": "Custom domain, notices and events", "plans": ["standard", "pro"]},
            {"label": "Complaint tracking and resident login", "plans": ["pro"], "planned": True},
        ],
        "details_step": "Add your society details, notices and contacts.",
        "whatsapp_number": None,
    },
}
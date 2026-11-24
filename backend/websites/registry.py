from dataclasses import dataclass


@dataclass(frozen=True)
class Template:
    key: str
    label: str
    layout: str
    palette: str


TEMPLATES = {
    "restau": (
        Template("restaurant-classic", "Restaurant Classic", "classic", "terracotta"),
        Template("restaurant-dhaba", "Dhaba", "split", "saffron"),
        Template("restaurant-bistro", "Bistro", "editorial", "wine"),
        Template("restaurant-cafe", "Café", "card", "coffee"),
        Template("restaurant-night", "Night Dining", "banner", "midnight"),
    ),
    "edu": (
        Template("education-classic", "Education Classic", "classic", "forest"),
        Template("education-admissions", "Admissions", "split", "navy"),
        Template("education-campus", "Campus", "editorial", "plum"),
        Template("education-learning", "Learning Studio", "card", "teal"),
        Template("education-open-day", "Open Day", "banner", "blue"),
    ),
    "tour": (
        Template("tour-explorer", "Explorer", "classic", "forest"),
        Template("tour-adventure", "Adventure", "split", "rust"),
        Template("tour-heritage", "Heritage", "editorial", "sand"),
        Template("tour-escape", "Escape", "card", "ocean"),
        Template("tour-holidays", "Holidays", "banner", "violet"),
    ),
}


def template_choices(business_type):
    return tuple((item.key, item.label) for item in TEMPLATES.get(business_type, ()))


TEMPLATE_CHOICES = tuple(
    choice for business_type in TEMPLATES for choice in template_choices(business_type)
)

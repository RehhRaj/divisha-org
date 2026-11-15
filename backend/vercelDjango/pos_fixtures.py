"""Sample data for the local restaurant POS."""
POS_FIXTURES = {
    ("jeetu", "restau"): {
        "menu": [
            {"id": "chai-01", "name": "Chai", "price_paise": 2500, "available": True},
            {"id": "paratha-01", "name": "Paratha", "price_paise": 10000, "available": True},
            {"id": "lassi-01", "name": "Lassi", "price_paise": 6000, "available": False},
        ],
        "tables": ["Table 1", "Table 2"],
    },
    ("pilot", "restau"): {
        "menu": [
            {"id": "coffee-01", "name": "Coffee", "price_paise": 5000, "available": True},
            {"id": "toast-01", "name": "Toast", "price_paise": 7500, "available": True},
            {"id": "soupe-01", "name": "pine apple Toast", "price_paise": 7500, "available": True},
        ],
        "tables": ["Counter table"],
    },
}

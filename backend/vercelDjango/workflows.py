DEMOS = {
    "society": {
        "name": "Society maintenance",
        "title": "From a resident’s report to a clear resolution.",
        "intro": "Follow a maintenance request as it moves from the resident to the society office and the team doing the work.",
        "theme": "green",
        "example": "Water leak near the lift lobby",
        "steps": [
            ["Raise a request", "A resident describes the leak and shares the location."],
            ["Acknowledge and assign", "The society office records the request and assigns it to maintenance."],
            ["Resolve and confirm", "The team logs the repair and the resident can give feedback."],
        ],
    },
    "school": {
        "name": "School operations",
        "title": "Give school requests a clear path.",
        "intro": "See how staff can pass a facilities request to the right person and follow it through to completion.",
        "theme": "blue",
        "example": "Projector in Room 204 needs service",
        "steps": [
            ["Report the issue", "A teacher identifies the room and describes what is going wrong."],
            ["Schedule the work", "The office assigns the request to the facilities team."],
            ["Confirm the fix", "Facilities records the repair and informs the teacher."],
        ],
    },
    "travel": {
        "name": "Travel enquiries",
        "title": "Turn a travel enquiry into a trip plan.",
        "intro": "Follow an example enquiry as a travel operator gathers preferences and prepares an itinerary.",
        "theme": "amber",
        "example": "A family asks about a weekend in Jaipur",
        "steps": [
            ["Collect trip details", "The traveller shares dates, group size and preferences."],
            ["Prepare an itinerary", "The operator drafts an itinerary based on the brief."],
            ["Share the next steps", "The traveller receives the proposed plan and can request changes."],
        ],
    },
}

TENANTS = {"himalaya": "society", "teal": "society", "jeetu": "society", **{key: key for key in DEMOS}}

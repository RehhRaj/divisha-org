from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("websites", "0002_landingpage")]

    operations = [
        migrations.AlterField(
            model_name="website",
            name="template",
            field=models.CharField(max_length=50, choices=[('restaurant-classic', 'Restaurant Classic'), ('restaurant-dhaba', 'Dhaba'), ('restaurant-bistro', 'Bistro'), ('restaurant-cafe', 'Café'), ('restaurant-night', 'Night Dining'), ('education-classic', 'Education Classic'), ('education-admissions', 'Admissions'), ('education-campus', 'Campus'), ('education-learning', 'Learning Studio'), ('education-open-day', 'Open Day'), ('tour-explorer', 'Explorer'), ('tour-adventure', 'Adventure'), ('tour-heritage', 'Heritage'), ('tour-escape', 'Escape'), ('tour-holidays', 'Holidays')]),
        ),
        migrations.AlterField(
            model_name="website",
            name="published_template",
            field=models.CharField(
                max_length=50, choices=[('restaurant-classic', 'Restaurant Classic'), ('restaurant-dhaba', 'Dhaba'), ('restaurant-bistro', 'Bistro'), ('restaurant-cafe', 'Café'), ('restaurant-night', 'Night Dining'), ('education-classic', 'Education Classic'), ('education-admissions', 'Admissions'), ('education-campus', 'Campus'), ('education-learning', 'Learning Studio'), ('education-open-day', 'Open Day'), ('tour-explorer', 'Explorer'), ('tour-adventure', 'Adventure'), ('tour-heritage', 'Heritage'), ('tour-escape', 'Escape'), ('tour-holidays', 'Holidays')], blank=True, editable=False,
            ),
        ),
    ]

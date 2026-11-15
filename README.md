# Divisha.org

Divisha resolves a hostname to a platform page, business demo or tenant site in
Django. Next.js renders the returned content. Restaurant presentation and public
ordering are composed by `RestaurantSite.tsx`. Other business types use
`TemplateView.tsx`. Staff POS remains a local demo at `/pos`.

## Local setup

Use Python 3.12+ and Node.js 22+. In one terminal:

```sh
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python manage.py migrate
export JEETU_ORDER_WHATSAPP=YOUR_COUNTRY_CODE_AND_NUMBER

export JEETU_ORDER_WHATSAPP="919810014587"
python manage.py runserver 127.0.0.1:8000

```

Set `JEETU_ORDER_WHATSAPP` to a WhatsApp number you control, with country code
and digits only. Restart Django after changing the environment. Without a
configured number, the restaurant website displays its menu with checkout hidden.

In another terminal:

```sh
cd frontend
npm ci
DJANGO_API_URL=http://127.0.0.1:8000/api/page/ npm run dev
```

| URL | What to check |
|---|---|
| http://localhost:3000/ | Platform homepage |
| http://restau.localhost:3000/?variant=fine-dining | Fine Dining palette and surface |
| http://jeetu-restau.localhost:3000/ | Customer takeaway cart and WhatsApp draft |
| http://jeetu-restau.localhost:3000/?table=demo-table-07 | Table 07 ordering |
| http://jeetu-restau.localhost:3000/?table=wrong | Invalid table message and no checkout |
| http://teal-restau.localhost:3000/ | Fine Dining website |
| http://jeetu-restau.localhost:3000/pos | Local staff POS |
| http://jeetu-tour.localhost:3000/ | Tour tenant |
| http://apexacademy-edu.localhost:3000/ | Education tenant |
| http://abc-society.localhost:3000/ | Society tenant |

A QR code may encode the complete HTTPS tenant URL with its table token for
phone testing against a deployed site. The included token is sample data.
Replace sample table tokens with unique random values for each table before
printing them. The token chooses the table for the WhatsApp draft. It does not
prove the customer is physically at that table. Staff confirms orders and
payments directly. Opening WhatsApp leaves the local cart intact.

## Configuration and deployment

- `site_registry.py` owns tenant identity, host mapping, assigned variant,
  brand colours and public ordering settings.
- `template_config.py` owns Restaurant variant defaults. Tenant overrides are
  resolved in Django. Next.js owns CSS.
- `tenant_catalogs.py` owns sample catalog content. POS uses separate fixtures.
- `ordering.py` resolves the public checkout destination and table context
  for the selected site. Public checkout drafts have no backend order record.
- Set `DJANGO_DEBUG=0`, `DJANGO_SECRET_KEY` and `DJANGO_ALLOWED_HOSTS` on the Django
  host. Use `vercelDjango.wsgi:application`. Set `DJANGO_API_URL` on Next.js to
  the full Django page endpoint. Deploy Django first.
- Use `python manage.py test vercelDjango.tests` from backend and
  `npm run build` from frontend.

The current milestone uses fixture-backed tenants and public feature settings.
For self-service onboarding, move tenants, sites, verified domains and feature
entitlements to a database. Appointment booking, external authenticated APIs
and partner white-label controls are future modules.



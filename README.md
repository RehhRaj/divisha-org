# Divisha Business OS

Multi-tenant website platform: **Next.js frontend** (`frontend/`) + **Django JSON API** (`backend/`).
The frontend reads the request hostname, asks Django for `/api/page/?host=...`, and renders the
matching platform page, demo, or business website.

> Status: prototype. All tenant data is still hardcoded in Python files (no database models yet).
> See `CHANGES.md` for what was fixed and `Known limits` below for what is not built.

## Hostnames

| Host | Shows |
| --- | --- |
| `divisha.org` | Platform home |
| `restau.divisha.org` etc. | Business-type landing / demo |
| `jeetu-restau.divisha.org` | Tenant site (`<tenant>-<type>`) |
| `*.localhost:3000` | Same as above, for local development |

## Run locally

Backend (Python 3.12+):

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env            # then export the variables (see below)
export DJANGO_DEBUG=1           # REQUIRED for local: default is OFF (safe for production)
python manage.py test
python manage.py runserver 8000
```

Frontend (Node 20+):

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev                     # open http://jeetu-restau.localhost:3000
```

## Environment variables

Backend (`backend/.env.example`): `DJANGO_DEBUG`, `DJANGO_SECRET_KEY`, `DJANGO_ALLOWED_HOSTS`,
`DJANGO_CSRF_TRUSTED_ORIGINS`, `DJANGO_SSL_REDIRECT`, `DJANGO_HSTS_SECONDS`, `DJANGO_ADMIN_URL`,
`DJANGO_POS_DEMO`.

WhatsApp order numbers are **not** environment variables: each tenant's `ordering.whatsapp_number`
in the Django record (`site_registry.py`, later the database) is the only source.

Frontend (`frontend/.env.example`): `DJANGO_API_URL`, `POS_DEMO_ENABLED`.

## Production checklist

1. `DJANGO_DEBUG=0` (default) and a long random `DJANGO_SECRET_KEY`.
2. Set `DJANGO_ALLOWED_HOSTS` and `DJANGO_CSRF_TRUSTED_ORIGINS` for your real domains.
3. Check HTTPS works, then set `DJANGO_SSL_REDIRECT=1` and `DJANGO_HSTS_SECONDS=31536000`.
4. Change `DJANGO_ADMIN_URL` from `admin/`.
5. Keep `DJANGO_POS_DEMO` and `POS_DEMO_ENABLED` off unless you are showing the POS demo.

## POS demo

`/pos` is a **demo**: bills live in the browser's localStorage, nothing is saved on a server and no
real payment happens. It runs on `*.localhost` in development. For a hosted demo set
`DJANGO_POS_DEMO=1` (Django) and `POS_DEMO_ENABLED=1` (Next.js); it then works only on
`*.divisha.org` tenants that have `restaurant_pos` enabled.

## Known limits (not built yet)

Database models, tenant login/dashboard, enquiry/booking/complaint forms, saved orders, real POS
backend, billing, custom-domain onboarding, dedicated Education/Salon templates, frontend tests.

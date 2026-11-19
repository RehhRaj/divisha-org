# Divisha.org · Stage 1

Django 6.1.3 + Django Ninja 1.8.0, PostgreSQL and Next.js 16. This standalone
rebuild contains four sample websites and separate tenant and platform panels.
Extract this ZIP into a new project directory and create a fresh backend virtual
environment there. Use Ninja's local API documentation at
http://127.0.0.1:8000/api/docs once Django is running.

## 1. Start the database and backend

Use Python 3.12 or 3.13, Node.js 22 or newer, and an empty PostgreSQL database for
this rebuild. If using Docker Compose, run the following from the project root.
The password prompt keeps the value out of shell history.

```bash
read -rsp 'Local PostgreSQL password: ' PGPASSWORD
export PGPASSWORD
printf '\n'
docker compose up -d postgres
```

If PostgreSQL is already running, use an empty database and set `PGHOST`,
`PGPORT`, `PGDATABASE`, `PGUSER`, and `PGPASSWORD` to match it. The default
database and user are both `divisha`. The Django test runner needs permission to
create a separate test database.

In that same terminal:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export DIVISHA_LOCAL=1
python manage.py migrate
python manage.py seed_stage
python manage.py createsuperuser --username platform_admin
for account in jeetu_restau_admin teal_restau_admin apexacademy_edu_admin horizon_edu_admin platform_support; do
  python manage.py changepassword "$account"
done
python manage.py test
python manage.py runserver 127.0.0.1:8000
```

The seed command creates tenant and support users with sign-in disabled until
you set individual passwords. Rerunning the seed preserves existing site content
and passwords. Use distinct passwords for each user.

## 2. Start the frontend

In a second terminal, from the project root:

```bash
cd frontend
npm ci
DJANGO_API_ORIGIN=http://127.0.0.1:8000 npm run dev
```

| Business type | Website | Tenant login | Capabilities |
|---|---|---|---|
| Restaurant | http://jeetu-restau.localhost:3000/ | jeetu_restau_admin | View, edit, publish |
| Restaurant | http://teal-restau.localhost:3000/ | teal_restau_admin | View, edit |
| Education | http://apexacademy-edu.localhost:3000/ | apexacademy_edu_admin | View, edit, publish |
| Education | http://horizon-edu.localhost:3000/ | horizon_edu_admin | View, publish |

All tenant accounts sign in at http://127.0.0.1:8000/panel/login/. Each account
sees its assigned tenant. Save draft and Publish saved draft are separate actions.

Platform accounts sign in at http://127.0.0.1:8000/platform-admin/.
`platform_admin` is the superuser for business types, tenants, domains, initial
website setup, users and role assignments. `platform_support` has read-only
access to business types, tenants and domains. A platform account needs an
explicit tenant role to use a tenant panel.

## Data and request flow

See [Stage 1 data and API contract](docs/stage-one.md).

Deployment requires a separate beta database and domain mapping, HTTPS, a
non-debug Django environment with the correct hosts, a private secret key and
database credentials, static file serving for Django Admin, and the deployed
Django API origin on Next.js. Verify the beta login and publishing flow, then
test restoring a database backup before onboarding real client data.

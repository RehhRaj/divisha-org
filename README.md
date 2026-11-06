# Divisha Business OS

The frontend uses Next.js 16.4.5 with React 19.3.1. The backend uses Django 6.0.10 with SQLite. Next.js reads the request hostname and asks Django's `/api/page/` endpoint which platform, demo or tenant page to render. The demo and tenant registry is in `backend/vercelDjango/views.py`.

## Run locally

Use Python 3.12–3.14 and a supported Node.js LTS release such as Node.js 22 or 24. The commands below use Bash. Start from the project root in each terminal.

**Terminal 1 — Django**

```bash
cd backend
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
export DJANGO_DEBUG=1
python manage.py check
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```

**Terminal 2 — Next.js**

```bash
cd frontend
npm ci
export DJANGO_API_URL=http://127.0.0.1:8000/api/page/
npm run dev
```

| URL | Expected page |
| --- | --- |
| http://localhost:3000/ | Divisha platform |
| http://tour.localhost:3000/ | Tour demo |
| http://jeetu-tour.localhost:3000/ | Jeetu Tour Business |
| http://abc-society.localhost:3000/ | ABC Co-operative Society |
| http://127.0.0.1:8000/api/page/?host=teal-restau.divisha.org | Teal Restaurant JSON |

To verify the production frontend locally, stop the dev server and run `npm run build` followed by `npm run start` in Terminal 2.

## Upgrade PythonAnywhere and Vercel

1. On PythonAnywhere, check the **Web** tab for the web app's Python version. Use Python 3.12 or 3.13 if available on your system image. Create a separate virtualenv with that same Python version and install `backend/requirements.txt` into it. The Bash console's default interpreter can differ from the web app's interpreter.
2. Before switching code or migrating, back up the live SQLite database and record the current WSGI and virtualenv settings. Find the database from the existing app's settings and set `DJANGO_DB_PATH` to that absolute path so the new checkout uses the existing data. Test the upgrade on a copy first.
3. Configure the PythonAnywhere WSGI file to import the upgraded checkout's `backend` directory and set `DJANGO_SETTINGS_MODULE=vercelDjango.settings`. Set the variables below in the web app's environment before Django loads, and use the same values in the Bash console for management commands. Set the new virtualenv in the **Web** tab.
4. With the new virtualenv active, run `python manage.py check --deploy`, `python manage.py migrate --plan`, `python manage.py migrate`, and `python manage.py collectstatic --noinput` from `backend/`. In the **Web** tab, map `/static/` to the configured static directory and enable Force HTTPS. Review any HTTPS/HSTS warnings in the context of PythonAnywhere's HTTPS settings. Reload the app and verify the API and admin login.
5. In Vercel, use `frontend` as the root directory and set `DJANGO_API_URL=https://gtbtax.pythonanywhere.com/api/page/`. Build and verify the platform and sample tenant hosts in a preview before promoting to production.

| Variable | Production value |
| --- | --- |
| `DJANGO_SECRET_KEY` | New private, randomly generated key. The old ZIP embedded a key. Rotating it can invalidate sessions and signed links. |
| `DJANGO_DEBUG` | `0` or unset |
| `DJANGO_ALLOWED_HOSTS` | `gtbtax.pythonanywhere.com`. This is the backend HTTP host. Tenant names are passed separately in the API query. |
| `DJANGO_DB_PATH` | Absolute path to the existing SQLite database |
| `DJANGO_STATIC_ROOT` | Absolute path used in the PythonAnywhere static mapping |
| `DJANGO_MEDIA_ROOT` | Absolute path to the existing media directory if in use |

The packaged source excludes the SQLite database and Git metadata. Apply the source changes to your existing checkout and keep the live database at the path selected above. The catch-all route uses `await headers()` for request-time rendering, and its Django fetch uses `cache: "no-store"`. Cache Components stay disabled in this configuration.

- [Django 6.0 release notes](https://docs.djangoproject.com/en/6.0/releases/6.0/)
- [PythonAnywhere virtualenv setup](https://help.pythonanywhere.com/pages/VirtualEnvForWebsites/)
- [Next.js headers reference](https://nextjs.org/docs/app/api-reference/functions/headers)

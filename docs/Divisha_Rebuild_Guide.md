# Divisha Business OS — Rebuild aur Deployment Guide

**23 November 2026 · Beta baseline**

Is guide se aap nayi machine par existing Git source se Divisha dobara chala sakte hain, ya PythonAnywhere aur Vercel par deployment recreate kar sakte hain. Working checkout ka exact commit, seed entry point aur production database path apne environment se confirm karein. Account passwords aur secret keys private rakhein.

## 1. Source aur database ka backup

1. Working laptop aur PythonAnywhere checkout mein `git status --short` aur `git rev-parse HEAD` chalayein. Vercel Deployment Details se frontend commit note karein. Agar commits alag hain, dono record karein. Uncommitted changes ko review karke preserve karein.
2. Git repository, verified commit(s), dependency lockfiles aur migrations preserve karein. PythonAnywhere Web tab se Python version, virtualenv, WSGI location aur static mapping note karein. Vercel se root directory, domains aur environment variable names note karein.
3. Current records bhi chahiye to live database ki consistent backup copy lein. SQLite ke liye live path confirm karke `sqlite3 /actual/live.sqlite3 ".backup /private/backup.sqlite3"` use kar sakte hain. Backup ko private rakhein aur restore rehearsal ek separate database file par karein. Fresh sample setup ke liye migrations aur seed use karein.

## 2. Project ka flow

Vercel par Next.js request hostname read karta hai. Django Ninja ke `/api/page/?host=<hostname>` se business landing ya tenant content resolve hota hai. Django admin aur tenant sign-in PythonAnywhere par hain. Hostname Next.js tak pahunchna aur Django database mein uska mapping hona dono zaruri hain.

| Area | Kahan dekhein |
| --- | --- |
| Dependency versions | `backend/requirements.txt`, `frontend/package.json` aur lockfile |
| Settings and routing | `backend/config/settings.py`, `backend/config/urls.py` |
| Platform admin | `backend/websites/platform_admin.py`, URL `/platform-admin/` |
| Tenant panel | `backend/websites/views.py`, URLs `/panel/login/` aur `/panel/t/<slug>/` |
| Public API | `backend/websites/api.py` |
| Frontend host routing | `frontend/app/[[...slug]]/page.tsx` |

## 3. Laptop par fresh setup

Repo URL ko apne Git remote se replace karein. Recorded revision checkout karein. Python aur Node versions ke liye source manifests aur working deployment dekhein.

```bash
git clone <REPO_URL> divisha-org
cd divisha-org
git checkout <WORKING_COMMIT>
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
export DIVISHA_LOCAL=1
export DIVISHA_SQLITE=1
python manage.py check
python manage.py migrate
```

SQLite local beta run ke liye simple option hai. Agar local PostgreSQL use karna hai, `DIVISHA_SQLITE` unset karein aur settings ke mutabik local database, role aur PG variables configure karein. Cloud se restore ki hui copy use kar rahe hain to pehle database path configure karein aur seed skip karein.

### Sample data aur admin accounts

Fresh database par repository ka seed entry point pehle locate karein.

```bash
rg --files | rg '(^|/)seed[^/]*\.py$|/management/commands/'
python manage.py help
```

Seed ka README/code dekhkar wahi command run karein jo is commit ke liye documented hai. Seed filename aur invocation checkout par depend karti hai. Seed unavailable ho to Platform Admin mein registered models se business types, tenants, domains, website content aur tenant memberships create karein. Public pages ke liye content publish karein. Development aur production hostname mappings dono check karein.

Existing `platform_admin` ka password reset karne ke liye `python manage.py changepassword platform_admin` use karein. Fresh DB mein account absent ho to `python manage.py createsuperuser --username platform_admin` use karein. Tenant accounts ko tenant membership aur required edit/publish permissions assign karein.

```bash
python manage.py test
python manage.py runserver 127.0.0.1:8000
```

Doosre terminal mein repo root se frontend start karein.

```bash
cd frontend
npm ci
export DJANGO_API_ORIGIN=http://127.0.0.1:8000
npm run dev
```

`npm ci` npm lockfile ke saath use karein. Agar checkout ka package manager alag hai, uska committed lockfile aur install command follow karein. Release se pehle `npm run build` chalayein.

## 4. PythonAnywhere par Django deploy karein

1. Verified backend commit checkout karein. Existing checkout update karte waqt `git status --short` dekhkar, branch `main` ho to `git pull --ff-only origin main` use karein. Frontend files ko exclude karna ho to fresh clone par sparse checkout configure kar sakte hain.
2. PythonAnywhere ke working setup mein Python 3.13 ka virtualenv `/home/gtbtax/.virtualenvs/divisha-env` use hua. Naya virtualenv Web app ke Python version se match karein. Venv activate karke backend requirements install karein.
3. Web tab mein source aur working directory `/home/gtbtax/divisha-org/backend` aur virtualenv ka absolute path set karein. WSGI file `/var/www/gtbtax_pythonanywhere_com_wsgi.py` se Django load karein. Example mein environment values WSGI import se pehle private configuration se load honi chahiye.

```python
import os
import sys

sys.path.insert(0, "/home/gtbtax/divisha-org/backend")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

from django.core.wsgi import get_wsgi_application

application = get_wsgi_application()
```

| Production variable | Value ya purpose |
| --- | --- |
| `DJANGO_SECRET_KEY` | Private production key |
| `DJANGO_ALLOWED_HOSTS` | `gtbtax.pythonanywhere.com` |
| `DIVISHA_SQLITE` | `1` for the beta SQLite deployment |
| `DIVISHA_SQLITE_PATH` | Optional absolute database path. Existing deployment restore karte waqt actual path confirm karein |
| `DIVISHA_LOCAL` | Production mein unset rakhein |
| `DJANGO_CSRF_TRUSTED_ORIGINS` | Sirf zarurat ho to actual trusted HTTPS origins configure karein |

4. Bash console mein **wahi settings aur DB path** load karein jo WSGI use karti hai. Bash exports aur WSGI configuration alag processes mein load hote hain. Existing data restore karna ho to backup file configure karke migrate karein. Fresh install mein migrate karke sample data aur accounts ka setup Section 3 ke mutabik karein.

```bash
cd ~/divisha-org/backend
source ~/.virtualenvs/divisha-env/bin/activate
python manage.py check
python manage.py migrate
python manage.py collectstatic --noinput
```

5. **Web → Static files** mein URL `/static/` ko `collectstatic` ke output wale absolute `STATIC_ROOT` se map karein. Phir **Reload**. [PythonAnywhere static files guide](https://help.pythonanywhere.com/pages/DjangoStaticFiles/)
6. [Admin CSS](https://gtbtax.pythonanywhere.com/static/admin/css/base.css) kholkar CSS text verify karein. [Divisha Platform Admin](https://gtbtax.pythonanywhere.com/platform-admin/) mein sign in karke registered model list kholein. `/admin/` is checkout ka route nahi hai. `/panel/` account ki assigned websites dikhata hai.

## 5. Vercel aur DNS

1. Git repo Vercel mein import karein. Next.js project ka Root Directory `frontend` rakhein aur working deployment ka Node version use karein.
2. Production environment mein `DJANGO_API_ORIGIN=https://gtbtax.pythonanywhere.com` set karein. Environment variable change ke baad redeploy karein. [Vercel environment variables](https://vercel.com/docs/environment-variables/managing-environment-variables)
3. Vercel Project → Domains mein required domains attach karein. Divisha ka registrar BigRock hai aur working setup mein Vercel nameservers use hue. Naya setup karte waqt Vercel ke current DNS instructions follow karein. `dig NS divisha.org` se delegation verify karein.
4. Django mein exact public hostname ko correct record se map karein. Har new tenant ke liye deployed frontend par routing, backend hostname mapping aur published content check karein.

## 6. End-to-end checks

| Check | Expected result |
| --- | --- |
| `http://localhost:3000/` aur `https://divisha.org/` | Divisha homepage |
| `restau.localhost:3000`, `restau.divisha.org`, `edu.divisha.org` | Respective business landing, jab mapping seeded ho |
| `jeetu-restau.divisha.org`, `teal-restau.divisha.org` | Respective restaurant pages |
| `apexacademy-edu.divisha.org`, `horizon-edu.divisha.org` | Respective school pages, jab mapped aur published hon |
| PythonAnywhere `/platform-admin/` | Styled login, sign in, registered records ki list |
| PythonAnywhere `/panel/login/` | Tenant admin sign-in aur assigned websites |
| Jeetu draft save → publish | Draft save par purana live text, publish par naya text |
| Teal draft aur tenant isolation | Teal draft save ho, publish permission absent ho. Jeetu admin ka Teal panel access denied ho |

```bash
curl -sS -i 'https://gtbtax.pythonanywhere.com/api/page/?host=jeetu-restau.divisha.org'
curl -sSI 'https://gtbtax.pythonanywhere.com/static/admin/css/base.css'
```

Pehli command mein HTTP 200 aur Jeetu ka JSON expected hai. Doosri mein 200 aur CSS content type expected hai. Local API ke liye PythonAnywhere origin ko `http://127.0.0.1:8000` aur host ko `jeetu-restau.localhost:3000` se replace karein.

## 7. Common problems

| Symptom | Check |
| --- | --- |
| Django 500 ya PythonAnywhere 502 | Web tab ka error log, virtualenv version, WSGI import path, settings aur secret key |
| `Website not found.` | Correct database, hostname mapping aur published content |
| `Set DJANGO_API_ORIGIN` | Vercel environment scope aur redeploy |
| Platform Admin HTML loads, CSS missing | CSS URL, `collectstatic`, exact `STATIC_ROOT` mapping, Reload aur hard refresh |
| Platform admin sees `No websites are assigned` | `/platform-admin/` kholein. `/panel/` tenant assignments dikhata hai |
| Password reset ka effect nahi | Bash aur WSGI ka database path match karein |

Rebuild complete tab hai jab public pages, styled Platform Admin, tenant login aur draft/publish permissions upar ke checks pass karein. Us run ke verified commits aur non-secret deployment settings note karein.

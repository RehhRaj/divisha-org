# Divisha template pilot — laptop runbook

Is example mein patch ka naam `divisha-template-pilot.patch`, branch `feature/template-pilot`, aur pilot admin `pilot_highway_restau_admin` hai. Agle patch ke liye ye values us feature ke hisaab se badlein. Commands Bash ke liye hain.

## 1. Patch lagayein — project root se

Project root woh folder hai jiske andar `backend/` aur `frontend/` hain. `pwd` se current folder aur `git status --short` se pending changes dekhein. Khali status ka matlab working tree clean hai. Agar pehle se apna kaam pending hai, use commit ya alag se preserve karke aage badhein.

```bash
git status --short
git switch main &&
git pull --ff-only origin main &&
git switch -c feature/template-pilot
```

Agar branch pehle se bani hai, `git switch feature/template-pilot` use karein. Neeche Downloads path ka example hai. Agar patch project root mein hai, `patch_file="./divisha-template-pilot.patch"` use karein.

```bash
patch_file="$HOME/Downloads/divisha-template-pilot.patch"
git apply --check "$patch_file" &&
git apply "$patch_file" &&
git diff --check &&
git status --short
```

`--check` files ko badle bina patch check karta hai. Agar fail ho, branch, patch ka base aur `git diff` dekhein. Extract ki hui ZIP ne wahi changes pehle hi files mein daal diye ho sakte hain. Aise mein diff verify karein aur patch dobara apply karne ki zarurat nahi hai.

## 2. Django environment taiyar karein

Project root se chalayein. Agar `.venv` abhi bana nahi hai, `cd backend` ke baad ek baar `python3 -m venv .venv` chalayein.

```bash
cd backend
source .venv/bin/activate
python -m pip install -r requirements.txt
```

Naya terminal kholne par virtualenv dobara activate karein aur database exports phir se chalayein. Agle section mein SQLite ya PostgreSQL mein se ek chun kar usi terminal mein aage badhein.

### Option A — alag SQLite pilot database

Ye laptop par pilot ke liye alag database path set karta hai.

```bash
export DIVISHA_LOCAL=1 DIVISHA_SQLITE=1
export DIVISHA_SQLITE_PATH="$HOME/divisha-template-pilot.sqlite3"

python manage.py shell -c '
from django.db import connection
print("Engine:", connection.vendor)
print("Database file:", connection.settings_dict["NAME"])
'
```

Expected engine `sqlite` hai. Database path aapke home folder ke andar `divisha-template-pilot.sqlite3` hona chahiye. Ye command configuration dikhati hai. Tables agle step mein `migrate` banayega.

### Option B — local PostgreSQL

Ye block maan kar chalta hai ki PostgreSQL service, `divisha` role aur `divisha` database laptop par pehle se bane hain. Isi database ko pilot data se update karna ho tab ye option use karein.

```bash
export DIVISHA_LOCAL=1 DIVISHA_SQLITE=0
unset DIVISHA_SQLITE_PATH
export DJANGO_CSRF_TRUSTED_ORIGINS=http://localhost:3000
export PGUSER=divisha PGDATABASE=divisha PGHOST=127.0.0.1 PGPORT=5432

read -rsp 'Local PostgreSQL password: ' PGPASSWORD
printf '\n'
export PGPASSWORD

python manage.py shell -c '
from django.db import connection
with connection.cursor() as cursor:
    cursor.execute("SELECT current_database(), current_user")
    print(connection.vendor, *cursor.fetchone())
'
```

Expected output `postgresql divisha divisha` hai. Agar error mein user `papa` ya socket path dikh raha hai, isi terminal mein `PGUSER` aur `PGHOST` exports check karein. Password error mein local PostgreSQL role ka password check karein. Kaam khatam hone par `unset PGPASSWORD` chala sakte hain.

## 3. Migrate, seed aur test — usi backend terminal mein

```bash
python manage.py check &&
python manage.py migrate &&
python manage.py seed_landings &&
python manage.py seed_template_pilot &&
python manage.py test
```

- `check` Django configuration check karta hai.
- `migrate` selected database ka schema update karta hai.
- `seed_landings` landing records aur `seed_template_pilot` pilot data set up karta hai. Ye commands is feature ke liye hain. Agar `Unknown command` aaye, `python manage.py help` aur current branch check karein.
- `test` repo ki test suite chalata hai. `&&` ke kaaran pehli failing command par chain rukti hai. Error fix karke usi step se resume karein. Seeds dobara chalane se pehle unka behavior dekh lein agar database mein edited content hai.

## 4. Pilot admin aur local server

Pilot admin ka password set ya reset karna ho to seed ke baad chalayein.

```bash
python manage.py changepassword pilot_highway_restau_admin
```

```bash
python manage.py runserver 127.0.0.1:8000
```

Backend server isi terminal mein chalta rahega. [Local tenant login](http://127.0.0.1:8000/panel/login/) kholkar pilot admin se login karein. User missing aaye to database selection aur pilot seed ka output check karein.

Agar frontend bhi check karna hai, doosra terminal project root par kholein.

```bash
cd frontend
npm ci
export DJANGO_API_ORIGIN=http://127.0.0.1:8000
npm run dev
```

`npm ci` ke liye committed npm lockfile chahiye. Tenant URL ke liye seed mein registered hostname use karein.

## 5. Feature commit karein, phir main mein merge karein

Project root par wapas jaiye. Diff review karein aur sirf feature ki files stage karein. Neeche `git add -p` tracked changes ke liye hai. Agar patch ne nayi files banayi hain, unko exact path dekar `git add` karein.

```bash
git status --short
git diff --check
git diff
git add -p
git diff --cached --check
git diff --cached
git commit -m "Add Divisha template pilot"
git status --short
```

Commit aur local checks ke baad merge karein.

```bash
git switch main &&
git pull --ff-only origin main &&
git merge --ff-only feature/template-pilot &&
git push origin main
```

Agar fast-forward merge fail ho, `git log --oneline --graph --decorate --all -20` se branch history dekhein. Aksar feature banane ke baad `main` mein naye commits aaye hote hain. Feature branch par latest `main` integrate karke tests dobara chalayein, phir merge retry karein. `git push` se remote main update hota hai. PythonAnywhere par backend deploy ek alag step hai.

## 6. Homepage ka draft live na dikhe to

1. [Platform admin](https://gtbtax.pythonanywhere.com/platform-admin/) mein homepage ka draft save karein. Edit page par Publish control na mile to record list ke `Action` dropdown mein check karein. Is deployment par homepage publish action ki availability abhi confirm nahi hai.
2. [Homepage API](https://gtbtax.pythonanywhere.com/api/page/?host=divisha.org) mein `description` dekhein. Agar purana text aaye, Django mein homepage publish action aur API ke published field ko check karein. Iske liye `backend/websites/platform_admin.py` aur `backend/websites/api.py` se shuru karein.
3. API mein naya text aaye aur [public homepage](https://divisha.org/) par purana text ho, to `frontend/app/[[...slug]]/page.tsx` mein homepage render aur API fetch check karein.
4. `/panel/` tenant assignments dikhata hai. Platform homepage ka record platform admin mein dekhein.

## Quick reference

| Kaam | Command ya check |
|---|---|
| Current folder | `pwd` |
| Current branch | `git branch --show-current` |
| Pending changes | `git status --short` |
| Patch ke badlav dekhna | `git apply --stat "$patch_file"` |
| Django ki commands dekhna | `python manage.py help` |
| Pending migrations dekhna | `python manage.py showmigrations` |
| Local server band karna | Server wale terminal mein `Ctrl+C` |
| Homepage update kahan atki hai | Pehle API ka `description`, phir public page |

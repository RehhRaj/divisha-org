# Business OS: Step 1 (business types, tenants aur templates)

Step 0 mein Django hostname dekhkar platform / business type / tenant pehchanta tha. Ab:

- Dummy tenants `backend/data/tenants.json` file mein hain (database baad mein).
- Har business type (school, hospital, restaurant) ka apna package hai: apne templates aur apna business logic. `core` ko inke naam nahi pata.
- Har tenant ko ek template milta hai. Next.js us template ke hisaab se page draw karta hai.
- Tenant subdomain se bhi khulta hai (`abc.school.localhost`) aur custom domain se bhi (`abc.com`).

```
Browser -> Next.js (:3000) --(X-Original-Host)--> Django (:8000) /api/message/
                                                   |
                                  core (resolver, registry)  <-- data/tenants.json
                                                   |
                                  business_types/school | hospital | restaurant
```

## Dummy data

| name | business type | template | custom domain | contact | status |
| --- | --- | --- | --- | --- | --- |
| abc | school | school-template-a | abc.com | 123456789 | active |
| hsbc | hospital | hos-template-b | hscb.com | hb123456789 | pending |
| ss school | school | school-template-b | ss.com | sss123456789 | active |
| norw | hospital | hos-template-a | norw.com | nor895hh | active |

Templates: `school-template-a` (sidebar, letter grade), `school-template-b` (cards, CGPA), `hos-template-a` (sidebar, clinic), `hos-template-b` (cards, multi-specialty), `restaurant-template-a` (sidebar, POS).

## Local run

Terminal 1, Django:

```bash
cd backend
python3 -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt
PLATFORM_ROOT_DOMAIN=localhost python manage.py runserver 8000
```

Terminal 2, Next.js:

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Custom domains ke liye `/etc/hosts` mein ek line jodein (subdomain wale URL ke liye iski zaroorat nahi):

```
127.0.0.1 abc.com ss.com hscb.com norw.com
```

| URL | Kya dikhega |
| --- | --- |
| http://localhost:3000 | Business OS marketing homepage. |
| http://school.localhost:3000 | default view for business type: school |
| http://abc.school.localhost:3000 | abc, school-template-a (sidebar) |
| http://abc.com:3000 | wahi tenant (custom domain se) |
| http://ss.com:3000 | ss school, school-template-b (cards, 6 modules) |
| http://norw.com:3000 | norw, hos-template-a (sidebar) |
| http://hscb.com:3000 | hsbc: pending, template nahi dikhta, API 403 deti hai |
| http://dps.school.localhost:3000 | Unknown host (dps data file mein nahi hai) |
| http://gym.localhost:3000 | Unknown host (gym registered business type nahi hai) |

Data file badalne par Django restart nahi chahiye (DEBUG mein file khud reload hoti hai). Galat data (unknown template, doosre business type ka template, duplicate domain, galat status) hone par Django start hote hi saaf error deta hai.

## Tests (Django install kiye bina chalte hain)

```bash
cd backend
python3 -m unittest discover -s tests -t . -v
```

## Naya business type jodna (jaise gym)

1. `backend/business_types/gym/` banayein: `__init__.py` (BUSINESS_TYPE), `templates.py`, `logic.py`. School wala folder example hai.
2. `config/settings.py` ke `ENABLED_BUSINESS_TYPES` mein `"business_types.gym"` jodein.
3. `core` aur frontend mein koi badlav nahi.

## Naya template jodna

1. Us business type ke `templates.py` mein ek `TemplateSpec` jodein (key, layout, theme, modules, options).
2. `tenants.json` mein tenant ka `"template"` us key par set karein.
3. Naya layout chahiye to `frontend/templates/layouts.tsx` mein component banakar `LAYOUTS` mein naam se jodein.

## Database par jaana (baad mein)

`core/registry.py` mein sirf tenants load karne wala hissa badlega. `find_tenant`, `find_tenant_by_domain`, `business_type` wahi rahenge, isliye resolver, API response aur frontend nahi badlenge.

## Production

- `PLATFORM_ROOT_DOMAIN=mysite.com` set karein aur DNS mein wildcard record rakhein: `*.mysite.com` aur `*.*.mysite.com` (do-level subdomain ke liye alag wildcard chahiye).
- Custom domain (jaise abc.com): tenant ka domain platform ke server par point karein (CNAME/A record). Har custom domain ke liye TLS certificate chahiye (automatic issuance, jaise Caddy on-demand TLS ya Let's Encrypt). Domain sirf tab accept karein jab wo `tenants.json` (baad mein DB) mein ho.
- Reverse proxy (nginx/Caddy) original `Host` ko `X-Forwarded-Host` mein Next.js tak pahunchaye. Next.js ise `X-Original-Host` banakar Django ko bhejta hai.
- Django API ko public internet par expose na karein: wo `X-Original-Host` par bharosa karta hai.
- `DJANGO_ALLOWED_HOSTS`, `DJANGO_SECRET_KEY` aur `DJANGO_DEBUG=0` set karein, aur `gunicorn config.wsgi` se chalayein.

## Files

- `backend/core/contracts.py`: business type ka contract (modules, templates, greeting)
- `backend/core/registry.py`: business types aur tenants load + validate
- `backend/core/resolver.py`: hostname -> level/business_type/tenant (custom domain + subdomain)
- `backend/core/api.py`: `/api/message/` ka response banata hai (pure Python)
- `backend/core/views.py`: `/api/message/`, `/api/health/`
- `backend/business_types/<type>/`: us business type ke templates aur business logic
- `backend/data/tenants.json`: dummy tenants
- `frontend/lib/context.ts`: API ke types aur fetch
- `frontend/templates/`: layouts (sidebar, cards), message view
- `frontend/app/[[...slug]]/page.tsx`: host ke hisaab se template ya message render


## Updated platform homepage

The platform root (`http://localhost:3000`) now shows a responsive Business OS landing page with a hero visual, platform highlights, industry cards, and a three-step overview. Tenant and business-type hostnames still use the existing API-driven templates/messages. The hero image is stored locally at `frontend/public/business-os-hero.png`.

**Port note:** Django on `http://localhost:8000` is the backend API in this project (`/api/message/` and `/api/health/`). The website UI is served by Next.js on `http://localhost:3000`. Start both services using the commands above.

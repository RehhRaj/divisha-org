# Business OS — simple guide (Hindi/English)

## Page kaise kaam karta hai
1. `app/[[...slug]]/page.tsx` har URL ko handle karta hai.
2. `lib/page-data.ts` website ka hostname Django API (`/api/page/?host=...`) ko bhejta hai.
3. Django bata deta hai ki ye kaun sa page hai (`page_type`):
   - `platform` → `HomePage` (main divisha.org)
   - `business_landing` → `templates/platform/BusinessLanding`
   - `demo` / `tenant` → `SiteRenderer` (restaurant ka alag renderer, baaki `TemplateView`)
4. Kuch na mile toh `not-found`.

## Data kahan edit karein (abhi database nahi hai)
- Naya business/tenant: `backend/vercelDjango/site_registry.py`
- Menu / packages: `backend/vercelDjango/tenant_catalogs.py`
- Default sample text: `backend/vercelDjango/sample_content.py`
- Platform plans: `backend/vercelDjango/platform_landings.py`
- Platform home ka text: `HomePage.tsx` ke upar `businessTypes` aur `steps`

Setup, env variables aur production checklist ke liye root `README.md` dekhein.

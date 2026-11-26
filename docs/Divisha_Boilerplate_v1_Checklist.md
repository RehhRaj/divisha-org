# Divisha Boilerplate v1 — Checklist aur implementation guide

**Target:** Restaurant (`restau`), Education (`edu`) aur Tour and Travel (`tour`) ke liye business-specific template folders, har type ke kam se kam 5 selectable template variants, aur har type ke 3 tenants. Ek type ke teen tenants teen alag variants use karein. Baaki variants ko preview ya test fixtures se verify karein.

Checkbox tab tick karein jab expected result verify ho. Test ke saath date, environment aur commit ya URL note karein.

## 1. Ab tak ke confirmed achievements

- [x] Jeetu ka published page live hostname par render hua. Draft save aur publish ka difference user ne verify kiya.
- [x] Teal editor draft save kar saka aur publish access nahi tha. Jeetu admin ka Teal panel access deny hua.
- [x] Timcy ke liye live hostname mapping aur tenant owner ke Publish action ke baad website live hui.
- [x] Template Pilot source mein shared `TenantSite.tsx` renderer, presentation settings aur draft/published title, description aur template flow identify hua.

Ye checks pehle ke versions par report hue the. Refactor ke baad inhe dobara run karein.

## 2. Template structure refactor

```text
frontend/templates/
├── TenantSite.tsx
├── registry.ts
├── types.ts
├── shared/
│   ├── BasicSite.tsx
│   ├── SiteHeader.tsx
│   └── SiteFooter.tsx
├── restaurant/
│   ├── RestaurantSite.tsx
│   └── MenuSection.tsx
├── education/
│   └── EducationSite.tsx
└── tour/
    ├── TourSite.tsx
    └── PackagesSection.tsx
```

- [ ] Current branch aur deployed template keys note karein. Jeetu, ek Education tenant aur Timcy ka current API response aur page check karein.
- [ ] `TenantSite.tsx` ka existing markup aur styles `shared/BasicSite.tsx` aur saath wali CSS module mein move karein. Pehle isi markup ko business renderers mein reuse karein.
- [ ] `types.ts` mein published API contract rakhein. `TenantSite.tsx` published template key se renderer select kare. `registry.ts` supported keys ko renderers se map kare.
- [ ] Existing published keys preserve karein, including Timcy ke Adventure option ki saved key. Unknown legacy key ke liye safe `BasicSite` rendering verify karein.
- [ ] Django template catalog allowed keys, business-type eligibility aur presentation values validate kare. Frontend registry rendering sambhale. Contract check se verify karein ki Django se selectable variant frontend mein resolve hota hai.
- [ ] Existing layout, palette, content aur Tenant Login link tino business types par compare karein.

**Done jab** refactor se existing tenant pages ka behavior preserve ho aur ek business type ke renderer ka change uske apne folder mein ho sake. Shared header ya footer mein change karte waqt usko use karne wale tino types check karein.

## 3. Jeetu par ek complete feature banayein

- [ ] Django website model, tenant form aur validation mein ek menu item ka name aur price support karein. Existing records ke liye empty menu handle karein.
- [ ] Tenant panel mein existing edit capability aur publish service reuse karein. Draft menu save karein aur authorized Publish par published menu update karein.
- [ ] Django Ninja API se published menu array bhejein. Next.js `restaurant/MenuSection.tsx` mein data hone par menu aur header ka Menu link render karein.
- [ ] Jeetu owner se ek dish aur price save karein. Draft save ke baad API aur public site par purani price verify karein. Publish ke baad dono jagah nayi price verify karein.
- [ ] Header, navigation, timings, contact aur footer add karein. Missing optional content par uska section aur navigation link hide ho.
- [ ] Mobile par menu, long dish names aur contact links check karein. Published title, meta description aur canonical URL verify karein.

**Done jab** Jeetu owner ek price update tenant panel se publish kar sake aur deploy ki zarurat ke bina public page update ho.

## 4. Education aur Tour par pattern prove karein

- [ ] Education mein ek editable admissions ya programmes section draft se publish tak verify karein.
- [ ] Timcy mein ek editable tour package draft se publish tak verify karein. Tour business landing aur Timcy tenant website alag hostnames par resolve hon.
- [ ] Har type mein same header/footer components reuse karein jahan zarurat ho. Business-specific markup aur CSS us type ke folder mein rakhein.
- [ ] Education aur Tour mein mobile layout, contact links aur metadata verify karein.

## 5. Variants aur tenant coverage

Pehle existing `classic`, `split`, `editorial`, `card`, `banner` presentation options ka reuse evaluate karein. Har variant ko stable key dein. Layout aur palette Django se aayen. Jahan variant ko genuinely alag markup chahiye, uska component usi business folder mein rakhein.

| Business type | Tenant slots | Release target |
|---|---|---|
| Restaurant | Jeetu, Teal, teesra pilot tenant | 5+ variants verified, 3 alag published keys |
| Education | Apex Academy, Horizon Academy, teesra pilot tenant | 5+ variants verified, 3 alag published keys |
| Tour and Travel | Timcy, do aur pilot tenants | 5+ variants verified, 3 alag published keys |

- [ ] 15 ya zyada variants catalog mein selectable hain aur preview/test mein render hote hain.
- [ ] Nau tenants ke hostname, tenant slug aur published template key record kiye gaye hain.
- [ ] Ek tenant ka variant badal kar draft save karein. Public layout purana rahe. Publish ke baad naya layout aaye aur same type ke doosre tenant ka layout preserve ho.

## 6. Reusable onboarding aur release check

1. Platform Admin mein business type select ya create karein. Business landing chahiye to uska apna hostname assign karein.
2. Tenant create karke live Domain map karein. Frontend hosting par hostname routing verify karein.
3. Tenant Website draft aur compatible template set karein. Owner membership aur `website.edit` / `website.publish` access verify karein.
4. Tenant owner se existing panel mein draft save aur publish karein.
5. Pehle Django API ka published payload dekhein. Phir public site desktop aur mobile par kholein.
6. Editor ke liye publish denied aur doosre tenant ke admin ke liye cross-tenant access denied verify karein.

| Symptom | Pehla check |
|---|---|
| API 404 | Domain mapping, active tenant aur website ka publish status |
| Tenant URL par pricing landing | Landing record aur tenant domain ke hostnames |
| API mein naya content, site par purana | Next.js renderer aur cache behavior |
| Publish control missing | Tenant membership aur role par capability assignment |
| Template select hota hai, render fallback hai | Published key aur frontend registry ki mapping |

- [ ] Django checks/tests, frontend build aur local tenant pages pass.
- [ ] Staging ya pilot deployment par permissions, draft/publish, metadata aur mobile checks pass.
- [ ] Ek fresh tenant ko isi checklist se onboarding karke public URL verify kiya.
- [ ] Release commit aur verification evidence note kiya.

**Evidence example:** Date · Environment · Tenant · Template key · Draft result · Publish result · Mobile/SEO result · Commit ya URL.

**Ab pehla kaam:** Refactor branch mein existing `TenantSite` markup ko `BasicSite` mein move karke registry wire karein. Jeetu, Education aur Timcy ki baseline verify hone par Jeetu ka pehla editable menu item implement karein.

**Scale guideline:** Naya business folder tab add karein jab uske sections ya rendering alag hon. Simple website types shared layout reuse kar sakte hain. Tenant-specific data Django mein rahe. Hostname lookup, database indexes aur tenant-scoped caching ka kaam actual traffic aur measurements ke hisaab se plan karein.

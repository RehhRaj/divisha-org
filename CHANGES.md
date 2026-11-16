# Changes in this version

Database models were intentionally **not** added (as requested).

## Fixed
- `RestaurantCheckoutTests` was failing (expected `919000000000`, code returned `919911112823`).
  Decision: the WhatsApp number is controlled **only by the Django record** (`ordering.whatsapp_number`).
  Tests now expect the record's number, check local == production host, and prove the old
  `JEETU_ORDER_WHATSAPP` env var cannot override it (unused `whatsapp_env` key removed).
  An invalid number in a record disables WhatsApp ordering (tested).
- Title typo "Jeetu newwwwwwww Tour Business" -> "Jeetu Tour Business".
- Teal "Beetroot Carpaccio" price 8950 -> 450 (**assumed typo; please confirm the real price**).
- POS fixture id `soupe-01` / "pine apple Toast" -> `toast-02` / "Pineapple Toast" (+ unique-id test).
- Removed the unused duplicate `TENANTS` in `workflows.py`, the old `old  no seo page.tsx`,
  `__pycache__` and the empty `db.sqlite3`.

## Production safety (`settings.py`)
- `DJANGO_DEBUG` now defaults to **off**. For local work set `DJANGO_DEBUG=1`.
- `ALLOWED_HOSTS` includes `divisha.org` and `.divisha.org`.
- Added `CSRF_TRUSTED_ORIGINS`, proxy SSL header, opt-in `SECURE_SSL_REDIRECT` / HSTS, nosniff,
  basic logging, configurable admin URL (`DJANGO_ADMIN_URL`).

## POS
- Backend: hosted demo allowed on `*.divisha.org` only when `DJANGO_POS_DEMO=1` (still read-only,
  tenant-scoped; off by default). Local `*.localhost` behaviour unchanged.
- Frontend: `/pos` works on hosted demo when `POS_DEMO_ENABLED=1`; API base falls back to the
  production API instead of `127.0.0.1`; uses `x-forwarded-host` like the rest of the app.
- Still a demo: data lives in browser localStorage, no real payments.

## Docs
- Added root `README.md`, `.env.example` files, `.gitignore`; rewrote the outdated
  `README_SIMPLE_HINDI.md`.

## Not verified here
Django and Node packages could not be installed in the build sandbox, so the tests, `next build`
and `biome` were **not run**. Python files compile. Please run `python manage.py test` and
`npm run build` once.

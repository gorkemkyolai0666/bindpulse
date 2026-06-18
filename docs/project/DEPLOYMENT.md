# BindPulse — Deployment Guide

## Altyapı

- **Backend:** Railway (NestJS + PostgreSQL)
- **Frontend:** Vercel (Next.js)
- **Veritabanı:** Railway PostgreSQL

## Ortam Değişkenleri

### Backend (Railway)
- `DATABASE_URL` — PostgreSQL bağlantı dizesi
- `JWT_SECRET` — JWT imzalama anahtarı
- `FRONTEND_URL` — Vercel frontend URL'si
- `PORT` — 4032

### Frontend (Vercel)
- `NEXT_PUBLIC_API_URL` — Railway backend URL'si + /api

## Demo Hesap

- **E-posta:** demo@kadikoyrestorasyon.com
- **Şifre:** demo123456

## CI/CD Zinciri

1. PR açılır → backend build + test + integration test
2. Frontend build
3. main'e merge → provision job (Railway + Vercel)

## Portlar

| Servis | Port |
|--------|------|
| Backend | 4032 |
| Frontend | 3032 |

## Sağlık Kontrolü

```
GET /api/health → { status: "ok", database: "connected" }
```

## Smoke Test

1. Login: POST /api/auth/login
2. Dashboard: GET /api/dashboard/stats
3. CRUD: POST/PATCH/DELETE /api/projects

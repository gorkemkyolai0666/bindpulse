# BindPulse

Kitap restorasyon ve ciltleme atölyeleri için operasyon yönetim platformu.

## Özellikler

- Restorasyon proje takibi (kabul, değerlendirme, işlem, teslim)
- Cilt envanteri (kitap/el yazması durumu, koşul değerlendirmesi)
- Malzeme stok yönetimi (deri, kağıt, altın varak, iplik, tutkal)
- Randevu planlaması (teslim alma, teslimat, danışma)
- Tezgah kapasite yönetimi
- Firma profil yönetimi
- Panel ve istatistikler

## Teknolojiler

- **Backend:** NestJS, Prisma, PostgreSQL
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Tasarım:** Editorial yönelim — serif tipografi, bordo/fildişi/deri kahve palet

## Hızlı Başlangıç

```bash
# PostgreSQL başlatın
docker-compose up postgres -d

# Backend
cd backend
npm install --legacy-peer-deps
cp .env.example .env
npx prisma migrate deploy
npx prisma db seed
npm run start:dev

# Frontend
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## Demo Hesap

- **E-posta:** demo@kadikoyrestorasyon.com
- **Şifre:** demo123456

## Portlar

- Backend: 4032
- Frontend: 3032

# BindPulse — Product Requirements Document

## Vizyon

Türkiye'deki bağımsız kitap restorasyon ve ciltleme atölyelerinin operasyonel süreçlerini dijitalleştiren SaaS platformu.

## Hedef Kitle

- Bağımsız kitap restorasyoncuları (2-8 kişilik atölyeler)
- Antika kitap satıcıları
- Kütüphane koruma birimleri
- Üniversite ciltleme servisleri

## Sektör

Bibliyografik sanatlar, kültürel miras koruma

## Problem

1. Restorasyon projeleri el ile takip ediliyor — kayıp/gecikme riski
2. Nadir malzeme (altın varak, özel deri, Japon kağıdı) stokları kontrol edilemiyor
3. Müşteri randevuları ve teslimat planları karışıyor
4. Tezgah kapasite planlaması yapılamıyor
5. Maliyet takibi zor — proje başına malzeme kullanımı bilinmiyor

## Tasarım Yönelimi

**Editorial** — kitap ve basım dünyasından ilham alan serif-ağırlıklı tipografi, sıcak tonlar:
- Birincil: Bordo (#8b1d40)
- İkincil: Fildişi (#fdf9f0)
- Aksan: Deri kahve (#744537)
- Font: Playfair Display (başlık) + Inter (gövde)
- Geniş beyaz alan, klasik oranlar, minimal bezeme

## İş Modeli

B2B SaaS — tezgah başına aylık abonelik

## Temel Özellikler (MVP)

1. Kimlik doğrulama (kayıt/giriş)
2. Restorasyon proje yönetimi (CRUD + durum akışı)
3. Cilt envanteri (koşul değerlendirmesi, durum takibi)
4. Malzeme stok yönetimi (kategori, fiyat, tedarik süresi)
5. Randevu planlaması
6. Tezgah kapasite yönetimi
7. Panel istatistikleri
8. Firma profili

## Teknik Mimari

- Backend: NestJS + Prisma + PostgreSQL
- Frontend: Next.js 14 + Tailwind CSS
- Dağıtım: Railway (backend) + Vercel (frontend)

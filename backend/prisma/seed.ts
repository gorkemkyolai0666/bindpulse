import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const FIRM_ID = '00000000-0000-0000-0000-000000000001';

async function main() {
  const passwordHash = await bcrypt.hash('demo123456', 12);

  await prisma.firm.upsert({
    where: { id: FIRM_ID },
    update: {},
    create: {
      id: FIRM_ID,
      name: 'Kadıköy Kitap Restorasyon Atölyesi',
      phone: '+905559876543',
      address: 'Bahariye Caddesi No: 42',
      city: 'İstanbul',
      state: 'Marmara',
      zipCode: '34714',
      totalWorkbenches: 3,
      timezone: 'Europe/Istanbul',
      users: {
        create: {
          email: 'demo@kadikoyrestorasyon.com',
          passwordHash,
          firstName: 'Emir',
          lastName: 'Kaya',
          role: 'owner',
        },
      },
    },
  });

  const projectData = [
    { id: '00000000-0000-0000-0000-000000000101', projectNumber: 'BP-2401', clientName: 'Beyazıt Devlet Kütüphanesi', projectType: 'restoration' as const, volumeCount: 5, status: 'in_progress' as const, benchName: 'Tezgah-A' },
    { id: '00000000-0000-0000-0000-000000000102', projectNumber: 'BP-2402', clientName: 'Özel Koleksiyon — Osmanlı El Yazması', projectType: 'conservation' as const, volumeCount: 1, status: 'awaiting_materials' as const, benchName: 'Tezgah-B' },
    { id: '00000000-0000-0000-0000-000000000103', projectNumber: 'BP-2403', clientName: 'Sahaflar Çarşısı Antika Kitapçı', projectType: 'rebinding' as const, volumeCount: 8, status: 'ready' as const, benchName: 'Tezgah-A' },
    { id: '00000000-0000-0000-0000-000000000104', projectNumber: 'BP-2404', clientName: 'Üniversite Tez Ciltleme Siparişi', projectType: 'custom_binding' as const, volumeCount: 12, status: 'delivered' as const, benchName: 'Tezgah-C' },
    { id: '00000000-0000-0000-0000-000000000105', projectNumber: 'BP-2405', clientName: 'Müze Koleksiyon Bakım Sözleşmesi', projectType: 'conservation' as const, volumeCount: 20, status: 'quoted' as const },
    { id: '00000000-0000-0000-0000-000000000106', projectNumber: 'BP-2406', clientName: 'Antikacı — 18. Yüzyıl Divan Cildi', projectType: 'gilding' as const, volumeCount: 1, status: 'assessment' as const, benchName: 'Tezgah-B' },
  ];

  for (const p of projectData) {
    await prisma.restorationProject.upsert({
      where: { id: p.id },
      update: {},
      create: { ...p, firmId: FIRM_ID, dueDate: new Date() },
    });
  }

  const volumeData = [
    { id: '00000000-0000-0000-0000-000000000201', title: 'Divan-ı Kebir (Mevlana)', author: 'Mevlana Celaleddin Rumi', condition: 'poor' as const, status: 'in_restoration' as const, estimatedHours: 40, projectId: '00000000-0000-0000-0000-000000000101' },
    { id: '00000000-0000-0000-0000-000000000202', title: 'Kanuni Devri El Yazması', author: 'Bilinmeyen', condition: 'critical' as const, status: 'awaiting_materials' as const, estimatedHours: 80, projectId: '00000000-0000-0000-0000-000000000102' },
    { id: '00000000-0000-0000-0000-000000000203', title: 'İstanbul Ansiklopedisi Cilt III', author: 'Reşad Ekrem Koçu', condition: 'fair' as const, status: 'completed' as const, estimatedHours: 12, projectId: '00000000-0000-0000-0000-000000000103' },
  ];

  for (const v of volumeData) {
    await prisma.volumeItem.upsert({
      where: { id: v.id },
      update: {},
      create: { ...v, firmId: FIRM_ID },
    });
  }

  const scheduledAt = new Date();
  scheduledAt.setDate(scheduledAt.getDate() + 3);

  await prisma.appointmentJob.upsert({
    where: { id: '00000000-0000-0000-0000-000000000301' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000301',
      firmId: FIRM_ID,
      projectId: '00000000-0000-0000-0000-000000000101',
      appointmentName: 'Kütüphane Teslim Randevusu',
      appointmentType: 'delivery',
      benchName: 'Tezgah-A',
      volumeCount: 5,
      scheduledAt,
      status: 'scheduled',
      notes: 'Öğleden sonra 14:00 — sigortalı taşıma gerekli',
    },
  });

  await prisma.appointmentJob.upsert({
    where: { id: '00000000-0000-0000-0000-000000000302' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000302',
      firmId: FIRM_ID,
      projectId: '00000000-0000-0000-0000-000000000106',
      appointmentName: 'Antikacı Durum Değerlendirmesi',
      appointmentType: 'assessment',
      benchName: 'Tezgah-B',
      volumeCount: 1,
      scheduledAt: new Date(),
      status: 'in_progress',
      notes: 'Altın varak durumu incelenecek',
    },
  });

  const benchDate = new Date();
  benchDate.setDate(benchDate.getDate() + 5);

  await prisma.workbench.upsert({
    where: { id: '00000000-0000-0000-0000-000000000401' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000401',
      firmId: FIRM_ID,
      title: 'Osmanlı Cildi Restorasyon Seansı',
      description: 'Deri işleme, altın varak uygulama ve ebru kapak hazırlığı',
      artisan: 'Emir Kaya',
      scheduledAt: benchDate,
      maxSlots: 4,
      booked: 2,
      status: 'scheduled',
    },
  });

  const materials = [
    { id: '00000000-0000-0000-0000-000000000501', title: 'Keçi Derisi (Koyu Kahve)', materialCategory: 'leather' as const, pricePerUnit: 1200, stockQty: 6, leadDays: 14 },
    { id: '00000000-0000-0000-0000-000000000502', title: 'Japon Tamir Kağıdı 12gsm', materialCategory: 'paper' as const, pricePerUnit: 450, stockQty: 15, leadDays: 7 },
    { id: '00000000-0000-0000-0000-000000000503', title: '23K Altın Varak (50 yaprak)', materialCategory: 'gold_leaf' as const, pricePerUnit: 3800, stockQty: 2, leadDays: 21 },
    { id: '00000000-0000-0000-0000-000000000504', title: 'Keten İplik (Doğal)', materialCategory: 'thread' as const, pricePerUnit: 180, stockQty: 20, leadDays: 3 },
    { id: '00000000-0000-0000-0000-000000000505', title: 'Nişasta Bazlı Tutkal', materialCategory: 'adhesive' as const, pricePerUnit: 95, stockQty: 8, leadDays: 5 },
  ];

  for (const m of materials) {
    await prisma.materialStock.upsert({
      where: { id: m.id },
      update: {},
      create: { ...m, firmId: FIRM_ID, status: 'active' },
    });
  }

  console.log('BindPulse seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

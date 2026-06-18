'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';

export default function FirmPage() {
  const { token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [firm, setFirm] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !token) router.replace('/login');
  }, [token, authLoading, router]);

  useEffect(() => {
    if (token) {
      api.firm.get(token).then((f: any) => setFirm(f)).catch(() => {}).finally(() => setLoading(false));
    }
  }, [token]);

  if (authLoading || !token) return null;

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      <aside className="hidden md:flex flex-col w-56 border-r py-6 px-4" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
        <div className="mb-8 px-2">
          <Link href="/dashboard" className="text-xl font-serif font-bold text-burgundy-800 dark:text-burgundy-300">BindPulse</Link>
        </div>
        <nav className="flex-1 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm" style={{ color: 'var(--text-muted)' }}>◈ Panel</Link>
          <Link href="/projects" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm" style={{ color: 'var(--text-muted)' }}>◊ Projeler</Link>
          <Link href="/volumes" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm" style={{ color: 'var(--text-muted)' }}>▣ Ciltler</Link>
          <Link href="/materials" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm" style={{ color: 'var(--text-muted)' }}>◆ Malzemeler</Link>
          <Link href="/appointments" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm" style={{ color: 'var(--text-muted)' }}>◷ Randevular</Link>
          <Link href="/workbenches" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm" style={{ color: 'var(--text-muted)' }}>⊞ Tezgahlar</Link>
          <Link href="/firm" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm bg-burgundy-100 dark:bg-burgundy-950 text-burgundy-800 dark:text-burgundy-300 font-medium">⚙ Firma</Link>
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-10 max-w-3xl">
        <header className="mb-8">
          <h2 className="text-2xl font-serif font-bold" style={{ color: 'var(--text-primary)' }}>Firma Bilgileri</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Atölye profil detayları</p>
        </header>

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Yükleniyor...</p>
        ) : firm ? (
          <div className="border rounded-lg p-6 space-y-4" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
            <div>
              <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Atölye Adı</label>
              <p className="mt-1 font-serif text-lg" style={{ color: 'var(--text-primary)' }}>{firm.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Telefon</label>
                <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>{firm.phone || '—'}</p>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Şehir</label>
                <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>{firm.city || '—'}</p>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Adres</label>
              <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>{firm.address || '—'}</p>
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Toplam Tezgah</label>
              <p className="mt-1 font-mono" style={{ color: 'var(--text-primary)' }}>{firm.totalWorkbenches}</p>
            </div>
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>Firma bilgisi bulunamadı</p>
        )}
      </main>
    </div>
  );
}

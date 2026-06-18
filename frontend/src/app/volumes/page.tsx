'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';

const conditionLabels: Record<string, string> = {
  excellent: 'Mükemmel',
  good: 'İyi',
  fair: 'Orta',
  poor: 'Kötü',
  critical: 'Kritik',
};

const statusLabels: Record<string, string> = {
  in_workshop: 'Atölyede',
  awaiting_materials: 'Malzeme Bekliyor',
  in_restoration: 'Restorasyonda',
  completed: 'Tamamlandı',
  returned: 'İade Edildi',
};

export default function VolumesPage() {
  const { token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [volumes, setVolumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !token) router.replace('/login');
  }, [token, authLoading, router]);

  useEffect(() => {
    if (token) {
      api.volumes.list(token).then((res: any) => setVolumes(res.data || [])).catch(() => {}).finally(() => setLoading(false));
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
          <Link href="/volumes" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm bg-burgundy-100 dark:bg-burgundy-950 text-burgundy-800 dark:text-burgundy-300 font-medium">▣ Ciltler</Link>
          <Link href="/materials" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm" style={{ color: 'var(--text-muted)' }}>◆ Malzemeler</Link>
          <Link href="/appointments" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm" style={{ color: 'var(--text-muted)' }}>◷ Randevular</Link>
          <Link href="/workbenches" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm" style={{ color: 'var(--text-muted)' }}>⊞ Tezgahlar</Link>
          <Link href="/firm" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm" style={{ color: 'var(--text-muted)' }}>⚙ Firma</Link>
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-10 max-w-6xl">
        <header className="mb-8">
          <h2 className="text-2xl font-serif font-bold" style={{ color: 'var(--text-primary)' }}>Cilt Envanteri</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Atölyedeki kitap ve el yazması koleksiyonu</p>
        </header>

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Yükleniyor...</p>
        ) : volumes.length === 0 ? (
          <div className="text-center py-16 border rounded-lg" style={{ borderColor: 'var(--border)' }}>
            <p className="text-lg font-serif" style={{ color: 'var(--text-muted)' }}>Henüz cilt kaydı bulunmuyor</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {volumes.map((v: any) => (
              <div key={v.id} className="border rounded-lg p-5 hover:shadow-sm transition-shadow" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
                <h3 className="font-serif font-semibold" style={{ color: 'var(--text-primary)' }}>{v.title}</h3>
                {v.author && <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{v.author}</p>}
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-xs px-2 py-0.5 rounded border" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                    {conditionLabels[v.condition] || v.condition}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {statusLabels[v.status] || v.status}
                  </span>
                  {v.estimatedHours && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>~{v.estimatedHours}s</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

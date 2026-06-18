'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';

const statusLabels: Record<string, string> = {
  intake: 'Kabul',
  assessment: 'Değerlendirme',
  in_progress: 'Devam Ediyor',
  awaiting_materials: 'Malzeme Bekliyor',
  quality_check: 'Kalite Kontrol',
  ready: 'Hazır',
  delivered: 'Teslim Edildi',
  quoted: 'Teklif Verildi',
};

const typeLabels: Record<string, string> = {
  restoration: 'Restorasyon',
  rebinding: 'Yeniden Ciltleme',
  gilding: 'Altın Varak',
  conservation: 'Koruma',
  custom_binding: 'Özel Cilt',
  repair: 'Onarım',
};

export default function ProjectsPage() {
  const { token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !token) router.replace('/login');
  }, [token, authLoading, router]);

  useEffect(() => {
    if (token) {
      api.projects.list(token).then((res: any) => setProjects(res.data || [])).catch(() => {}).finally(() => setLoading(false));
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
          <Link href="/projects" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm bg-burgundy-100 dark:bg-burgundy-950 text-burgundy-800 dark:text-burgundy-300 font-medium">◊ Projeler</Link>
          <Link href="/volumes" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm" style={{ color: 'var(--text-muted)' }}>▣ Ciltler</Link>
          <Link href="/materials" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm" style={{ color: 'var(--text-muted)' }}>◆ Malzemeler</Link>
          <Link href="/appointments" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm" style={{ color: 'var(--text-muted)' }}>◷ Randevular</Link>
          <Link href="/workbenches" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm" style={{ color: 'var(--text-muted)' }}>⊞ Tezgahlar</Link>
          <Link href="/firm" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm" style={{ color: 'var(--text-muted)' }}>⚙ Firma</Link>
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-10 max-w-6xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif font-bold" style={{ color: 'var(--text-primary)' }}>Restorasyon Projeleri</h2>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Tüm aktif ve tamamlanmış projeleriniz</p>
          </div>
        </header>

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Yükleniyor...</p>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 border rounded-lg" style={{ borderColor: 'var(--border)' }}>
            <p className="text-lg font-serif" style={{ color: 'var(--text-muted)' }}>Henüz proje bulunmuyor</p>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((p: any) => (
              <div key={p.id} className="border rounded-lg p-4 flex items-center justify-between hover:shadow-sm transition-shadow" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-ivory-200 dark:bg-ivory-950" style={{ color: 'var(--text-muted)' }}>{p.projectNumber}</span>
                    <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{p.clientName}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{typeLabels[p.projectType] || p.projectType}</span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{p.volumeCount} cilt</span>
                    {p.benchName && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{p.benchName}</span>}
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full border font-medium"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                  {statusLabels[p.status] || p.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

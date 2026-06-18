'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';

const typeLabels: Record<string, string> = {
  pickup: 'Teslim Alma',
  delivery: 'Teslimat',
  consultation: 'Danışma',
  assessment: 'Değerlendirme',
  corporate: 'Kurumsal',
};

export default function AppointmentsPage() {
  const { token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !token) router.replace('/login');
  }, [token, authLoading, router]);

  useEffect(() => {
    if (token) {
      api.appointments.list(token).then((res: any) => setAppointments(res.data || [])).catch(() => {}).finally(() => setLoading(false));
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
          <Link href="/appointments" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm bg-burgundy-100 dark:bg-burgundy-950 text-burgundy-800 dark:text-burgundy-300 font-medium">◷ Randevular</Link>
          <Link href="/workbenches" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm" style={{ color: 'var(--text-muted)' }}>⊞ Tezgahlar</Link>
          <Link href="/firm" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm" style={{ color: 'var(--text-muted)' }}>⚙ Firma</Link>
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-10 max-w-6xl">
        <header className="mb-8">
          <h2 className="text-2xl font-serif font-bold" style={{ color: 'var(--text-primary)' }}>Randevular</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Teslim alma, teslimat ve danışma randevuları</p>
        </header>

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Yükleniyor...</p>
        ) : appointments.length === 0 ? (
          <div className="text-center py-16 border rounded-lg" style={{ borderColor: 'var(--border)' }}>
            <p className="text-lg font-serif" style={{ color: 'var(--text-muted)' }}>Henüz randevu bulunmuyor</p>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((a: any) => (
              <div key={a.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
                <div className="flex items-center justify-between">
                  <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>{a.appointmentName}</h3>
                  <span className="text-xs px-2 py-0.5 rounded border" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                    {a.status === 'scheduled' ? 'Planlandı' : a.status === 'in_progress' ? 'Devam Ediyor' : a.status === 'completed' ? 'Tamamlandı' : a.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span>{typeLabels[a.appointmentType] || a.appointmentType}</span>
                  <span>{new Date(a.scheduledAt).toLocaleDateString('tr-TR')}</span>
                  {a.benchName && <span>{a.benchName}</span>}
                  {a.notes && <span className="italic">{a.notes}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { api } from '@/lib/api';

interface Stats {
  totalProjects: number;
  activeProjects: number;
  totalVolumes: number;
  lowStockMaterials: number;
  upcomingAppointments: number;
  activeBenches: number;
}

const navItems = [
  { href: '/dashboard', label: 'Panel', icon: '◈' },
  { href: '/projects', label: 'Projeler', icon: '◊' },
  { href: '/volumes', label: 'Ciltler', icon: '▣' },
  { href: '/materials', label: 'Malzemeler', icon: '◆' },
  { href: '/appointments', label: 'Randevular', icon: '◷' },
  { href: '/workbenches', label: 'Tezgahlar', icon: '⊞' },
  { href: '/firm', label: 'Firma', icon: '⚙' },
];

export default function DashboardPage() {
  const { token, user, logout, loading: authLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (!authLoading && !token) router.replace('/login');
  }, [token, authLoading, router]);

  useEffect(() => {
    if (token) {
      api.dashboard.stats(token).then((s: any) => setStats(s)).catch(() => {});
    }
  }, [token]);

  if (authLoading || !token) return null;

  const statCards = [
    { label: 'Toplam Proje', value: stats?.totalProjects ?? '—', accent: 'bg-burgundy-100 dark:bg-burgundy-950 text-burgundy-800 dark:text-burgundy-300' },
    { label: 'Aktif Proje', value: stats?.activeProjects ?? '—', accent: 'bg-leather-100 dark:bg-leather-950 text-leather-800 dark:text-leather-300' },
    { label: 'Cilt Envantesi', value: stats?.totalVolumes ?? '—', accent: 'bg-ivory-200 dark:bg-ivory-950 text-ivory-800 dark:text-ivory-300' },
    { label: 'Düşük Stok', value: stats?.lowStockMaterials ?? '—', accent: 'bg-burgundy-100 dark:bg-burgundy-950 text-burgundy-700 dark:text-burgundy-400' },
    { label: 'Yaklaşan Randevu', value: stats?.upcomingAppointments ?? '—', accent: 'bg-leather-100 dark:bg-leather-950 text-leather-700 dark:text-leather-400' },
    { label: 'Aktif Tezgah', value: stats?.activeBenches ?? '—', accent: 'bg-ivory-200 dark:bg-ivory-950 text-ivory-700 dark:text-ivory-400' },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      <aside className="hidden md:flex flex-col w-56 border-r py-6 px-4" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
        <div className="mb-8 px-2">
          <h1 className="text-xl font-serif font-bold text-burgundy-800 dark:text-burgundy-300">BindPulse</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Kitap Restorasyon</p>
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors hover:bg-ivory-200 dark:hover:bg-leather-900"
              style={{ color: 'var(--text-secondary)' }}>
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <button onClick={toggleTheme} className="text-xs px-3 py-1.5 rounded" style={{ color: 'var(--text-muted)' }}>
            {theme === 'light' ? '🌙 Karanlık Mod' : '☀️ Aydınlık Mod'}
          </button>
          <button onClick={logout} className="block text-xs px-3 py-1.5 mt-1 text-burgundy-600 dark:text-burgundy-400 hover:underline">
            Çıkış Yap
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 max-w-6xl">
        <header className="mb-10">
          <h2 className="text-3xl font-serif font-bold" style={{ color: 'var(--text-primary)' }}>
            Merhaba, {user?.firstName}
          </h2>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
            Atölye operasyonlarınızın güncel özeti
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {statCards.map((card) => (
            <div key={card.label} className="rounded-lg border p-5 transition-shadow hover:shadow-md" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                {card.label}
              </p>
              <p className="mt-2 text-3xl font-serif font-bold" style={{ color: 'var(--text-primary)' }}>
                {card.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 md:hidden">
          <nav className="grid grid-cols-4 gap-2">
            {navItems.slice(1).map((item) => (
              <Link key={item.href} href={item.href}
                className="flex flex-col items-center gap-1 p-3 rounded-lg border text-center text-xs"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </main>
    </div>
  );
}

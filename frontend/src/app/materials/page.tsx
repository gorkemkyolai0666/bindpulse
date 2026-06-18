'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';

const categoryLabels: Record<string, string> = {
  leather: 'Deri',
  paper: 'Kağıt',
  thread: 'İplik',
  adhesive: 'Tutkal',
  gold_leaf: 'Altın Varak',
  cloth: 'Kumaş',
  board: 'Mukavva',
  tool: 'Alet',
  chemical: 'Kimyasal',
};

export default function MaterialsPage() {
  const { token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !token) router.replace('/login');
  }, [token, authLoading, router]);

  useEffect(() => {
    if (token) {
      api.materials.list(token).then((res: any) => setMaterials(res.data || [])).catch(() => {}).finally(() => setLoading(false));
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
          <Link href="/materials" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm bg-burgundy-100 dark:bg-burgundy-950 text-burgundy-800 dark:text-burgundy-300 font-medium">◆ Malzemeler</Link>
          <Link href="/appointments" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm" style={{ color: 'var(--text-muted)' }}>◷ Randevular</Link>
          <Link href="/workbenches" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm" style={{ color: 'var(--text-muted)' }}>⊞ Tezgahlar</Link>
          <Link href="/firm" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm" style={{ color: 'var(--text-muted)' }}>⚙ Firma</Link>
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-10 max-w-6xl">
        <header className="mb-8">
          <h2 className="text-2xl font-serif font-bold" style={{ color: 'var(--text-primary)' }}>Malzeme Stoku</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Deri, kağıt, altın varak ve diğer ciltleme malzemeleri</p>
        </header>

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Yükleniyor...</p>
        ) : materials.length === 0 ? (
          <div className="text-center py-16 border rounded-lg" style={{ borderColor: 'var(--border)' }}>
            <p className="text-lg font-serif" style={{ color: 'var(--text-muted)' }}>Henüz malzeme kaydı bulunmuyor</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <th className="text-left py-3 px-2 font-medium" style={{ color: 'var(--text-muted)' }}>Malzeme</th>
                  <th className="text-left py-3 px-2 font-medium" style={{ color: 'var(--text-muted)' }}>Kategori</th>
                  <th className="text-right py-3 px-2 font-medium" style={{ color: 'var(--text-muted)' }}>Stok</th>
                  <th className="text-right py-3 px-2 font-medium" style={{ color: 'var(--text-muted)' }}>Birim Fiyat</th>
                  <th className="text-right py-3 px-2 font-medium" style={{ color: 'var(--text-muted)' }}>Tedarik Süresi</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((m: any) => (
                  <tr key={m.id} className="border-b hover:bg-ivory-50 dark:hover:bg-leather-950 transition-colors" style={{ borderColor: 'var(--border)' }}>
                    <td className="py-3 px-2 font-medium" style={{ color: 'var(--text-primary)' }}>{m.title}</td>
                    <td className="py-3 px-2" style={{ color: 'var(--text-secondary)' }}>{categoryLabels[m.materialCategory] || m.materialCategory}</td>
                    <td className="py-3 px-2 text-right font-mono" style={{ color: m.stockQty <= 3 ? 'var(--accent)' : 'var(--text-primary)' }}>{m.stockQty}</td>
                    <td className="py-3 px-2 text-right" style={{ color: 'var(--text-secondary)' }}>₺{m.pricePerUnit}</td>
                    <td className="py-3 px-2 text-right" style={{ color: 'var(--text-muted)' }}>{m.leadDays} gün</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

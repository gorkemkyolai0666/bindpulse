'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Giriş başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-secondary)' }}>
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-burgundy-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="relative z-10 px-12 text-center">
          <h1 className="text-5xl font-serif font-bold text-ivory-100 mb-4">BindPulse</h1>
          <p className="text-ivory-300 text-lg font-light leading-relaxed max-w-md">
            Kitap restorasyon ve ciltleme atölyeleri için tasarlanmış operasyon yönetim platformu
          </p>
          <div className="mt-8 flex items-center justify-center gap-6 text-ivory-400 text-sm">
            <span>Proje Takibi</span>
            <span className="w-1 h-1 rounded-full bg-ivory-500" />
            <span>Malzeme Stoku</span>
            <span className="w-1 h-1 rounded-full bg-ivory-500" />
            <span>Randevu Planı</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-serif font-bold" style={{ color: 'var(--text-primary)' }}>
              Hoş Geldiniz
            </h2>
            <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
              Atölye hesabınıza giriş yapın
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded bg-burgundy-50 dark:bg-burgundy-950 border border-burgundy-200 dark:border-burgundy-800 text-burgundy-700 dark:text-burgundy-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                E-posta
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-burgundy-400"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                placeholder="ornek@atolye.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Şifre
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-burgundy-400"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-md bg-burgundy-800 hover:bg-burgundy-700 text-white font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            Hesabınız yok mu?{' '}
            <Link href="/register" className="text-burgundy-700 dark:text-burgundy-400 hover:underline font-medium">
              Kayıt Olun
            </Link>
          </p>

          <div className="mt-8 p-4 rounded-lg border" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
            <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Demo Hesap</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              demo@kadikoyrestorasyon.com / demo123456
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

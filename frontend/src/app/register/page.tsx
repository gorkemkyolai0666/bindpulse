'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '', firmName: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Kayıt başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--bg-secondary)' }}>
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-serif font-bold" style={{ color: 'var(--text-primary)' }}>
            Atölye Kaydı
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            BindPulse ile atölyenizi dijitalleştirin
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-burgundy-50 dark:bg-burgundy-950 border border-burgundy-200 dark:border-burgundy-800 text-burgundy-700 dark:text-burgundy-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Ad</label>
              <input type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required
                className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-burgundy-400"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Soyad</label>
              <input type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required
                className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-burgundy-400"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Atölye Adı</label>
            <input type="text" value={form.firmName} onChange={(e) => setForm({ ...form, firmName: e.target.value })} required
              className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-burgundy-400"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>E-posta</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required
              className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-burgundy-400"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Şifre</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6}
              className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-burgundy-400"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-2.5 px-4 rounded-md bg-burgundy-800 hover:bg-burgundy-700 text-white font-medium transition-colors disabled:opacity-50 mt-2">
            {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
          Zaten hesabınız var mı?{' '}
          <Link href="/login" className="text-burgundy-700 dark:text-burgundy-400 hover:underline font-medium">
            Giriş Yapın
          </Link>
        </p>
      </div>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function HomePage() {
  const { token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (token) router.replace('/dashboard');
      else router.replace('/login');
    }
  }, [token, loading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="text-center">
        <h1 className="text-4xl font-serif font-bold text-burgundy-800 dark:text-burgundy-300 mb-2">
          BindPulse
        </h1>
        <p className="text-leather-600 dark:text-leather-400 font-light">Yükleniyor...</p>
      </div>
    </div>
  );
}

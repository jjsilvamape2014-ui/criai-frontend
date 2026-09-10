'use client';

import { useEffect } from 'react';
import { clearAuthTokenCookie } from '@/lib/auth-cookie';

export default function LogoutPage() {
  useEffect(() => {
    localStorage.removeItem('token');
    clearAuthTokenCookie();
    window.location.href = '/';
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: '#0B0A0C' }}>
      <p className="text-sm text-brand-tert">Saindo…</p>
    </div>
  );
}
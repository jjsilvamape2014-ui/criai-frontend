'use client';

import { useEffect } from 'react';
import Header from '@/components/Header';
import CerebroEditor from '@/components/CerebroEditor';
import { clearAuthTokenCookie } from '@/lib/auth-cookie';

export default function CerebroPage() {
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      clearAuthTokenCookie();
      window.location.href = '/login';
    }
  }, []);

  return (
    <div className="min-h-screen bg-brand-bg">
      <Header />
      <main className="mx-auto w-full max-w-[1440px] px-3 sm:px-5 pt-16 pb-0">
        <CerebroEditor />
      </main>
    </div>
  );
}
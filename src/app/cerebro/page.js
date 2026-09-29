'use client';

import { useEffect } from 'react';
import Header from '@/components/Header';
import CerebroEditor from '@/components/CerebroEditor';

export default function CerebroPage() {
  useEffect(() => {
    if (!localStorage.getItem('token')) window.location.href = '/login';
  }, []);

  return (
    <div className="min-h-screen bg-brand-bg">
      <Header />
      <main className="mx-auto w-full max-w-[860px] px-4 sm:px-6 pt-16 pb-0">
        <CerebroEditor />
      </main>
    </div>
  );
}
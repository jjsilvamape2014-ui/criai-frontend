'use client';

import { useEffect } from 'react';
import Header from '@/components/Header';
import CerebroEditor from '@/components/CerebroEditor';

export default function CerebroPage() {
  useEffect(() => {
    if (!localStorage.getItem('token')) window.location.href = '/login';
  }, []);

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-4xl px-4 pt-40 pb-16">
        <CerebroEditor />
      </main>
    </>
  );
}
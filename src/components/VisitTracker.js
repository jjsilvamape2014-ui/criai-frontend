'use client';

// Conta visitas para o painel do dono (/admin). Sem cookies e sem IP: só um id
// aleatório guardado no navegador, a página e de onde a pessoa veio.

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

function visitorId() {
  try {
    let v = localStorage.getItem('lf_vid');
    if (!v) {
      v = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2)).slice(0, 36);
      localStorage.setItem('lf_vid', v);
    }
    return v;
  } catch {
    return null;
  }
}

export default function VisitTracker() {
  const path = usePathname();
  useEffect(() => {
    if (!path || path.startsWith('/admin')) return;
    const v = visitorId();
    if (!v) return;
    const q = new URLSearchParams(window.location.search);
    const utm = q.get('utm_source') || (q.get('convite') ? 'convite' : '');
    let token = null;
    try { token = localStorage.getItem('token'); } catch {}
    fetch(`${API}/track`, {
      method: 'POST',
      keepalive: true,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ v, p: path, r: document.referrer || '', u: utm }),
    }).catch(() => {});
  }, [path]);
  return null;
}

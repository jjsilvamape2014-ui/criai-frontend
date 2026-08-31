'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import Header from '@/components/Header';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    if (password !== confirmPassword) { setError('As senhas nao coincidem'); setLoading(false); return; }
    try {
      const data = await api.register(email, password, name);
      localStorage.setItem('token', data.token);
      window.location.href = '/';
    } catch (err) {
      setError(err.message || 'Erro ao criar conta');
    } finally { setLoading(false); }
  };

  return (
    <>
      <Header />
      <div className="min-h-[80vh] flex items-center justify-center px-4 pt-20">
        <div className="w-full max-w-md">
          <div className="card-glow">
            <h1 className="text-2xl font-bold text-white mb-2">Crie sua conta</h1>
            <p className="text-gray-400 text-sm mb-6">
              Ganhe <b className="text-white">10 imagens e 2 videos gratis</b> todo mes. Sem cartao de credito.
            </p>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Nome</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="input" placeholder="Seu nome" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input" placeholder="seu@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Senha</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="input" placeholder="Minimo 6 caracteres" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Confirmar senha</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} className="input" placeholder="••••••••" />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Criando conta...' : 'Criar conta gratis'}</button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-6">
              Ja tem conta? <a href="/login" className="text-primary-400 font-semibold hover:underline">Fazer login</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

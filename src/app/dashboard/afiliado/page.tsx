'use client';

import { useState, useEffect } from 'react';

interface AffiliateStatus {
  clerk_user_id: string;
  is_premium: boolean;
  premium_since: string | null;
  is_affiliate: boolean;
  cakto_affiliate_link: string | null;
  total_referrals: number;
  referral_link: string;
}

// ─── Ícones embutidos (sem dependência externa) ───────────────
function Icon({ path, className = 'w-5 h-5', fill = 'none' }: { path: string; className?: string; fill?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d={path} />
    </svg>
  );
}
const CopyIcon = (p: any) => <Icon {...p} path="M8 4h10a2 2 0 0 1 2 2v10M16 8H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2z" />;
const CheckIcon = (p: any) => <Icon {...p} path="M20 6L9 17l-5-5" />;
const UsersIcon = (p: any) => <Icon {...p} path="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />;
const LinkIcon = (p: any) => <Icon {...p} path="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />;
const CrownIcon = (p: any) => <Icon {...p} path="M2 7l5 5 5-7 5 7 5-5v11a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7z" />;
const ExternalIcon = (p: any) => <Icon {...p} path="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />;
const AlertIcon = (p: any) => <Icon {...p} path="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />;
function Spinner({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={`${className} animate-spin`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export default function AfiliadoPage() {
  const [status, setStatus] = useState<AffiliateStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [affiliateLink, setAffiliateLink] = useState('');
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    fetchStatus();
  }, []);

  async function fetchStatus() {
    try {
      const res = await fetch('/api/affiliate/status');
      if (!res.ok) throw new Error('Erro ao buscar status');
      const data = await res.json();
      setStatus(data);
      if (data?.cakto_affiliate_link) {
        setAffiliateLink(data.cakto_affiliate_link);
      }
    } catch (err: any) {
      setError(err?.message ?? 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveLink() {
    if (!affiliateLink?.trim()) return;
    setSaving(true);
    setSaveMsg('');
    try {
      const res = await fetch('/api/affiliate/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cakto_affiliate_link: affiliateLink.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSaveMsg(data?.error ?? 'Erro ao salvar');
        return;
      }
      setSaveMsg('Link de afiliado salvo com sucesso!');
      fetchStatus();
    } catch (err: any) {
      setSaveMsg(err?.message ?? 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  }

  function copyToClipboard(text: string) {
    navigator?.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-rose-600">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <span className="text-red-500"><AlertIcon className="w-12 h-12" /></span>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-stone-800 mb-2 flex items-center gap-3">
        <span className="text-amber-500"><CrownIcon className="w-8 h-8" /></span>
        Painel de Afiliado
      </h1>
      <p className="text-stone-500 mb-8">
        Indique a LilithLove e ganhe comissão por cada assinatura.
      </p>

      {/* Status Premium */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-3 h-3 rounded-full ${status?.is_premium ? 'bg-emerald-500' : 'bg-stone-300'}`} />
          <span className="font-semibold text-stone-700">
            {status?.is_premium ? 'Assinante Premium' : 'Plano Gratuito'}
          </span>
        </div>
        {!status?.is_premium && (
          <p className="text-sm text-stone-500">
            Você precisa ser assinante premium para participar do programa de afiliados.
          </p>
        )}
      </div>

      {/* Link de Convite */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <h2 className="font-semibold text-stone-700 mb-3 flex items-center gap-2">
          <span className="text-rose-500"><UsersIcon /></span>
          Seu Link de Convite
        </h2>
        <p className="text-sm text-stone-500 mb-3">
          Compartilhe este link. Quando alguém criar conta por ele, será vinculado a você.
        </p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={status?.referral_link ?? ''}
            className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 text-sm text-stone-700 font-mono"
          />
          <button
            onClick={() => copyToClipboard(status?.referral_link ?? '')}
            className="flex items-center gap-1 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-lg transition-colors text-sm font-medium"
          >
            {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <h2 className="font-semibold text-stone-700 mb-4">Suas Indicações</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-rose-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-rose-600">{status?.total_referrals ?? 0}</p>
            <p className="text-sm text-stone-500 mt-1">Pessoas indicadas</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-amber-600">{status?.is_affiliate ? 'Ativo' : 'Inativo'}</p>
            <p className="text-sm text-stone-500 mt-1">Status do afiliado</p>
          </div>
        </div>
      </div>

      {/* Cadastrar Link de Afiliado Cakto */}
      {status?.is_premium && (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="font-semibold text-stone-700 mb-3 flex items-center gap-2">
            <span className="text-rose-500"><LinkIcon /></span>
            Link de Afiliado Cakto
          </h2>
          <p className="text-sm text-stone-500 mb-4">
            Cole aqui o link de afiliado que a Cakto gerou para você. Quando alguém que você indicou comprar por esse link, você receberá comissão.
          </p>
          <div className="flex items-center gap-2">
            <input
              type="url"
              placeholder="https://pay.cakto.com.br/seu-link"
              value={affiliateLink}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAffiliateLink(e.target.value)}
              className="flex-1 border border-stone-200 rounded-lg px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
            <button
              onClick={handleSaveLink}
              disabled={saving || !affiliateLink?.trim()}
              className="flex items-center gap-1 bg-stone-800 hover:bg-stone-900 text-white px-5 py-2.5 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
            >
              {saving ? <Spinner className="w-4 h-4" /> : <ExternalIcon className="w-4 h-4" />}
              Salvar
            </button>
          </div>
          {saveMsg && (
            <p className={`text-sm mt-3 ${saveMsg.includes('sucesso') ? 'text-emerald-600' : 'text-red-500'}`}>
              {saveMsg}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

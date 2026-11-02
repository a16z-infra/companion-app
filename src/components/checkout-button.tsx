'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface CheckoutButtonProps {
  /** Texto do botão */
  label?: string;
  /** Classes CSS extras */
  className?: string;
}

/**
 * Botão de checkout que redireciona para a Cakto.
 * Chama /api/checkout que resolve o link correto (afiliado ou padrão).
 */
export function CheckoutButton({
  label = 'Desbloquear Acesso Premium Ilimitado →',
  className = '',
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      // Redirecionar via API route que resolve o link correto
      window.location.href = '/api/checkout';
    } catch (err) {
      console.error('Erro ao redirecionar para checkout:', err);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={`w-full flex items-center justify-center gap-2 bg-rose-700 hover:bg-rose-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-60 ${
        className
      }`}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Sparkles className="w-5 h-5" />
      )}
      {loading ? 'Redirecionando...' : label}
    </button>
  );
}

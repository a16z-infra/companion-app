'use client';

import { useState } from 'react';

interface CheckoutButtonProps {
  /** Texto do botão */
  label?: string;
  /** Classes CSS extras */
  className?: string;
}

/**
 * Botão de checkout que redireciona para a Cakto.
 * Chama /api/checkout que resolve o link correto (afiliado ou padrão).
 * Usa SVG embutido para não depender de bibliotecas externas de ícones.
 */
export function CheckoutButton({
  label = 'Desbloquear Acesso Premium Ilimitado →',
  className = '',
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = () => {
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
      className={`w-full flex items-center justify-center gap-2 bg-rose-700 hover:bg-rose-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-60 ${className}`}
    >
      {loading ? (
        <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
      ) : (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2l1.9 5.8a2 2 0 0 0 1.3 1.3L21 11l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 20l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 11l5.8-1.9a2 2 0 0 0 1.3-1.3L12 2z" />
        </svg>
      )}
      {loading ? 'Redirecionando...' : label}
    </button>
  );
}

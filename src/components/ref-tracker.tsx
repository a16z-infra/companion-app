'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * Componente invisível que captura o parâmetro ?ref= da URL
 * e salva em um cookie com validade de 30 dias.
 * Deve ser incluído no layout principal (dentro de um <Suspense>).
 */
export function RefTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams?.get('ref');
    if (ref) {
      // Salvar cookie ref_by com validade de 30 dias
      const expires = new Date();
      expires.setDate(expires.getDate() + 30);
      document.cookie = `ref_by=${encodeURIComponent(ref)}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
      console.log(`Referência capturada: ${ref}`);
    }
  }, [searchParams]);

  return null;
}

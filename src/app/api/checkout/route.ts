/**
 * Rota de checkout — redireciona para o link correto da Cakto.
 * Se o usuário foi indicado (cookie ref_by), usa o link do afiliado.
 * Caso contrário, usa o link padrão.
 * Adiciona ?src=CLERK_USER_ID para rastreio.
 */
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { findAffiliateLink } from '@/lib/baserow';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    // Verificar se existe cookie de referência (quem indicou)
    const refBy = request.cookies.get('ref_by')?.value;

    let checkoutUrl = process.env.CAKTO_CHECKOUT_URL ?? 'https://pay.cakto.com.br/6nbag79';

    // Se tem referência, tentar buscar o link de afiliado
    if (refBy) {
      const affiliateLink = await findAffiliateLink(refBy);
      if (affiliateLink) {
        checkoutUrl = affiliateLink;
      }
    }

    // Adicionar src para rastreio do usuário
    const separator = checkoutUrl.includes('?') ? '&' : '?';
    const finalUrl = `${checkoutUrl}${separator}src=${userId}`;

    return NextResponse.redirect(finalUrl);
  } catch (error: any) {
    console.error('Erro no checkout:', error);
    return NextResponse.json(
      { error: 'Erro ao processar checkout' },
      { status: 500 }
    );
  }
}

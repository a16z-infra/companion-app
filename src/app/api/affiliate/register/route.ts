/**
 * Rota para cadastrar link de afiliado da Cakto.
 * O usuário precisa ser premium para se registrar como afiliado.
 */
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {
  findUserByClerkId,
  findAffiliateByClerkId,
  createAffiliate,
  updateAffiliate,
} from '@/lib/baserow';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const caktoAffiliateLink = body?.cakto_affiliate_link ?? '';

    if (!caktoAffiliateLink) {
      return NextResponse.json(
        { error: 'Link de afiliado é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se o usuário é premium
    const user = await findUserByClerkId(userId);
    if (!user?.is_premium) {
      return NextResponse.json(
        { error: 'Apenas usuários premium podem ser afiliados' },
        { status: 403 }
      );
    }

    // Verificar se já é afiliado
    const existingAffiliate = await findAffiliateByClerkId(userId);

    if (existingAffiliate?.id) {
      // Atualizar link existente
      await updateAffiliate(existingAffiliate.id, {
        cakto_affiliate_link: caktoAffiliateLink,
        is_active: true,
      });
      return NextResponse.json({ success: true, action: 'updated' });
    }

    // Criar novo afiliado
    await createAffiliate({
      clerk_user_id: userId,
      email: user?.email ?? '',
      cakto_affiliate_link: caktoAffiliateLink,
      is_active: true,
      total_referrals: 0,
    });

    return NextResponse.json({ success: true, action: 'created' });
  } catch (error: any) {
    console.error('Erro ao registrar afiliado:', error);
    return NextResponse.json(
      { error: 'Erro ao registrar afiliado' },
      { status: 500 }
    );
  }
}

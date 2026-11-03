/**
 * Retorna status do usuário: se é premium e se é afiliado.
 */
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { findUserByClerkId, findAffiliateByClerkId } from '@/lib/baserow';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const user = await findUserByClerkId(userId);
    const affiliate = await findAffiliateByClerkId(userId);

    return NextResponse.json({
      clerk_user_id: userId,
      is_premium: user?.is_premium ?? false,
      premium_since: user?.premium_since ?? null,
      is_affiliate: !!affiliate?.is_active,
      cakto_affiliate_link: affiliate?.cakto_affiliate_link ?? null,
      total_referrals: affiliate?.total_referrals ?? 0,
      referral_link: `https://lilithlove.site/?ref=${userId}`,
    });
  } catch (error: any) {
    console.error('Erro ao buscar status:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar status' },
      { status: 500 }
    );
  }
}

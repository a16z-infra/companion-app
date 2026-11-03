/**
 * Webhook do Clerk — recebe evento user.created.
 * Cria o registro do usuário no Baserow com o referred_by (se houver).
 */
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createUser, findUserByClerkId, incrementReferrals } from '@/lib/baserow';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const eventType = body?.type;

    // Processar apenas evento de criação de usuário
    if (eventType !== 'user.created') {
      return NextResponse.json({ received: true, action: 'ignored' });
    }

    const userData = body?.data;
    const clerkUserId = userData?.id ?? '';
    const email =
      userData?.email_addresses?.[0]?.email_address ??
      userData?.primary_email_address ?? '';

    if (!clerkUserId) {
      return NextResponse.json(
        { error: 'clerk_user_id ausente' },
        { status: 400 }
      );
    }

    // Verificar se já existe
    const existing = await findUserByClerkId(clerkUserId);
    if (existing) {
      return NextResponse.json({ received: true, action: 'already_exists' });
    }

    // O referred_by vem do metadata público do Clerk (definido no frontend)
    // ou via unsafe_metadata passado durante o signup
    const referredBy =
      userData?.public_metadata?.referred_by ??
      userData?.unsafe_metadata?.referred_by ??
      null;

    // Criar usuário no Baserow
    await createUser({
      clerk_user_id: clerkUserId,
      email: email,
      is_premium: false,
      premium_since: null,
      referred_by: referredBy,
      cakto_order_id: null,
    });

    // Se foi indicado, incrementar referências do afiliado
    if (referredBy) {
      await incrementReferrals(referredBy);
    }

    console.log(`Usuário ${clerkUserId} registrado no Baserow (ref: ${referredBy ?? 'nenhum'})`);
    return NextResponse.json({ received: true, action: 'user_created' });
  } catch (error: any) {
    console.error('Erro no webhook Clerk:', error);
    return NextResponse.json(
      { error: 'Erro interno no webhook' },
      { status: 500 }
    );
  }
}

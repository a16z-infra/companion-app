/**
 * Webhook da Cakto — recebe POST quando um pagamento é confirmado.
 * Busca o clerk_user_id no campo src/reference e marca o usuário como premium.
 */
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { findUserByClerkId, markUserPremium, createUser } from '@/lib/baserow';

export async function POST(request: NextRequest) {
  try {
    // Validar secret do webhook (header ou query param)
    const webhookSecret = process.env.CAKTO_WEBHOOK_SECRET;
    const receivedSecret =
      request.headers.get('x-webhook-secret') ??
      request.nextUrl.searchParams.get('secret');

    if (webhookSecret && receivedSecret !== webhookSecret) {
      console.error('Webhook Cakto: secret inválido');
      return NextResponse.json({ error: 'Secret inválido' }, { status: 403 });
    }

    const body = await request.json();
    console.log('Webhook Cakto recebido:', JSON.stringify(body));

    // A Cakto envia diferentes formatos — extrair dados relevantes
    // Campos comuns: email, status, reference/src, order_id
    const email = body?.email ?? body?.customer?.email ?? body?.buyer?.email ?? '';
    const status = body?.status ?? body?.payment_status ?? '';
    const clerkUserId =
      body?.src ??
      body?.reference ??
      body?.metadata?.src ??
      body?.metadata?.clerk_user_id ??
      '';
    const orderId =
      body?.order_id ??
      body?.transaction_id ??
      body?.id ??
      '';

    // Só processar se o pagamento foi aprovado
    const statusAprovado = ['approved', 'paid', 'completed', 'active'].includes(
      String(status).toLowerCase()
    );

    if (!statusAprovado) {
      console.log(`Webhook Cakto: status "${status}" ignorado (não aprovado)`);
      return NextResponse.json({ received: true, action: 'ignored' });
    }

    if (!clerkUserId) {
      console.error('Webhook Cakto: clerk_user_id não encontrado no payload');
      // Mesmo sem clerk_user_id, registrar por email se possível
      return NextResponse.json(
        { received: true, warning: 'clerk_user_id ausente' },
        { status: 200 }
      );
    }

    // Buscar ou criar o usuário no Baserow
    let user = await findUserByClerkId(clerkUserId);

    if (user?.id) {
      // Marcar como premium
      await markUserPremium(user.id, String(orderId));
      console.log(`Usuário ${clerkUserId} marcado como premium`);
    } else {
      // Criar registro novo já como premium
      await createUser({
        clerk_user_id: clerkUserId,
        email: email,
        is_premium: true,
        premium_since: new Date().toISOString().split('T')[0],
        referred_by: null,
        cakto_order_id: String(orderId),
      });
      console.log(`Usuário ${clerkUserId} criado como premium`);
    }

    return NextResponse.json({ received: true, action: 'premium_activated' });
  } catch (error: any) {
    console.error('Erro no webhook Cakto:', error);
    return NextResponse.json(
      { error: 'Erro interno no webhook' },
      { status: 500 }
    );
  }
}

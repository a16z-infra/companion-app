/**
 * Utilitário centralizado para CRUD no Baserow via API REST.
 * Todas as chamadas ao Baserow passam por aqui.
 */

const BASEROW_API_URL = process.env.BASEROW_API_URL ?? '';
const BASEROW_TOKEN = process.env.BASEROW_TOKEN ?? '';
const USERS_TABLE_ID = process.env.BASEROW_USERS_TABLE_ID ?? '';
const AFFILIATES_TABLE_ID = process.env.BASEROW_AFFILIATES_TABLE_ID ?? '';

function headers() {
  return {
    Authorization: `Token ${BASEROW_TOKEN}`,
    'Content-Type': 'application/json',
  };
}

// ─── Tipos ────────────────────────────────────────────────────
export interface UserPremium {
  id?: number;
  clerk_user_id: string;
  email: string;
  is_premium: boolean;
  premium_since: string | null;
  referred_by: string | null;
  cakto_order_id: string | null;
}

export interface Affiliate {
  id?: number;
  clerk_user_id: string;
  email: string;
  cakto_affiliate_link: string;
  is_active: boolean;
  total_referrals: number;
}

// ─── Funções genéricas ────────────────────────────────────────
async function listRows(tableId: string, filters?: Record<string, string>): Promise<any[]> {
  let url = `${BASEROW_API_URL}/api/database/rows/table/${tableId}/?user_field_names=true`;
  if (filters) {
    // Baserow usa filtros via query params
    // search é o mais simples para busca exata
    const searchValue = Object.values(filters)[0];
    if (searchValue) {
      url += `&search=${encodeURIComponent(searchValue)}`;
    }
  }
  const res = await fetch(url, { headers: headers(), cache: 'no-store' });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Baserow listRows falhou (${res.status}): ${err}`);
  }
  const data = await res.json();
  return data?.results ?? [];
}

async function createRow(tableId: string, fields: Record<string, any>): Promise<any> {
  const res = await fetch(
    `${BASEROW_API_URL}/api/database/rows/table/${tableId}/?user_field_names=true`,
    {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(fields),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Baserow createRow falhou (${res.status}): ${err}`);
  }
  return res.json();
}

async function updateRow(tableId: string, rowId: number, fields: Record<string, any>): Promise<any> {
  const res = await fetch(
    `${BASEROW_API_URL}/api/database/rows/table/${tableId}/${rowId}/?user_field_names=true`,
    {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify(fields),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Baserow updateRow falhou (${res.status}): ${err}`);
  }
  return res.json();
}

// ─── Funções específicas: users_premium ───────────────────────

/** Busca usuário premium pelo clerk_user_id */
export async function findUserByClerkId(clerkId: string): Promise<UserPremium | null> {
  const rows = await listRows(USERS_TABLE_ID, { clerk_user_id: clerkId });
  const match = rows?.find((r: any) => r?.clerk_user_id === clerkId);
  return match ?? null;
}

/** Cria registro de usuário no Baserow */
export async function createUser(user: Omit<UserPremium, 'id'>): Promise<UserPremium> {
  return createRow(USERS_TABLE_ID, user);
}

/** Marca usuário como premium */
export async function markUserPremium(rowId: number, caktoOrderId: string): Promise<any> {
  return updateRow(USERS_TABLE_ID, rowId, {
    is_premium: true,
    premium_since: new Date().toISOString().split('T')[0],
    cakto_order_id: caktoOrderId,
  });
}

// ─── Funções específicas: affiliates ──────────────────────────

/** Busca afiliado pelo clerk_user_id */
export async function findAffiliateByClerkId(clerkId: string): Promise<Affiliate | null> {
  const rows = await listRows(AFFILIATES_TABLE_ID, { clerk_user_id: clerkId });
  const match = rows?.find((r: any) => r?.clerk_user_id === clerkId);
  return match ?? null;
}

/** Registra um novo afiliado */
export async function createAffiliate(affiliate: Omit<Affiliate, 'id'>): Promise<Affiliate> {
  return createRow(AFFILIATES_TABLE_ID, affiliate);
}

/** Atualiza dados do afiliado */
export async function updateAffiliate(rowId: number, fields: Partial<Affiliate>): Promise<any> {
  return updateRow(AFFILIATES_TABLE_ID, rowId, fields);
}

/** Busca afiliado pelo clerk_user_id (para encontrar o link de checkout) */
export async function findAffiliateLink(referrerClerkId: string): Promise<string | null> {
  const affiliate = await findAffiliateByClerkId(referrerClerkId);
  return affiliate?.cakto_affiliate_link ?? null;
}

/** Incrementa o total_referrals de um afiliado */
export async function incrementReferrals(clerkId: string): Promise<void> {
  const affiliate = await findAffiliateByClerkId(clerkId);
  if (affiliate?.id) {
    await updateRow(AFFILIATES_TABLE_ID, affiliate.id, {
      total_referrals: (affiliate?.total_referrals ?? 0) + 1,
    });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { companions } from '@/app/api/companions/config';

export async function GET(req: NextRequest) {
  return NextResponse.json(companions, { status: 200 });
}
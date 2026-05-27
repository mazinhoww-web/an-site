import { NextResponse } from 'next/server';
import { getAllPalestras } from '@/lib/palestras';

export async function GET() {
  const palestras = await getAllPalestras();
  return NextResponse.json(palestras);
}

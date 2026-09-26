import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  
  if (!q) {
    return NextResponse.json([]);
  }
  
  try {
    const res = await fetch(`https://www.hebcal.com/complete?q=${encodeURIComponent(q)}`, {
      headers: {
        'User-Agent': 'Torah-Laneshma (Next.js)'
      }
    });
    
    if (!res.ok) {
      return NextResponse.json([]);
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Hebcal API error:', error);
    return NextResponse.json([]);
  }
}

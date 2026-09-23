import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Decode the pathname just in case it's not fully decoded
  const decodedPath = decodeURIComponent(pathname);

  // Adopt an Avrech
  if (decodedPath.includes('אמץ-אברך') || 
      decodedPath.includes('100-מהתרומה-ישירות-לאברך') ||
      decodedPath.includes('טופס-הצטרפות-אמץ-אברך') ||
      decodedPath.includes('אפשר-לתרום-ממעשר-כספים') ||
      decodedPath.includes('להיות-שותף-בלימוד-התורה') ||
      decodedPath.includes('אין-צורך-בסכום-חודשי-קבוע')) {
    return NextResponse.redirect(new URL('/adopt', request.url), 301);
  }

  // Articles
  if (decodedPath.includes('פרשת-לך-לך')) return NextResponse.redirect(new URL('/articles/lech-lecha', request.url), 301);
  if (decodedPath.includes('פרשת-נח')) return NextResponse.redirect(new URL('/articles/noah', request.url), 301);
  if (decodedPath.includes('פרשת-וירא')) return NextResponse.redirect(new URL('/articles/vayera', request.url), 301);
  if (decodedPath.includes('מהו-ביטחון-בהשם')) return NextResponse.redirect(new URL('/articles/bitachon', request.url), 301);
  if (decodedPath.includes('הכירו-את-החברותא-הטלפונית-שלנו')) return NextResponse.redirect(new URL('/articles/chavruta', request.url), 301);
  if (decodedPath.includes('פרשות-השבוע')) return NextResponse.redirect(new URL('/#content', request.url), 301);

  // Home Sections
  if (decodedPath.includes('איך-זה-עובד')) return NextResponse.redirect(new URL('/#how', request.url), 301);
  if (decodedPath.includes('מה-זה-חברותא')) return NextResponse.redirect(new URL('/#about', request.url), 301);
  if (decodedPath.includes('יחזיר-אותי-בתשובה')) return NextResponse.redirect(new URL('/#faq', request.url), 301);
  if (decodedPath.includes('אפשר-להציע-לך-חברותא') || decodedPath.includes('השאירו-פרטים-עכשיו')) return NextResponse.redirect(new URL('/#join', request.url), 301);
  if (decodedPath.includes('חברותא-טלפונית-ללימוד-תורה-ללא-עלות')) return NextResponse.redirect(new URL('/', request.url), 301);

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - any file with an extension (e.g. .jpg, .png, .svg)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.[\\w]+$).*)',
  ],
}

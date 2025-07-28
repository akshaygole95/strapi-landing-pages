
import { NextRequest, NextResponse } from 'next/server';


const SUPPORTED_LOCALES = ['en', 'es'];
const DEFAULT_LOCALE = 'en';

// Custom locale detection (e.g. from Accept-Language header)
function detectLocale(request: NextRequest): string {
  const acceptLang = request.headers.get('accept-language') ?? '';
  const preferred = acceptLang.split(',')[0].split('-')[0]; // e.g., 'en-US' => 'en'
  return SUPPORTED_LOCALES.includes(preferred) ? preferred : DEFAULT_LOCALE;
}

export function middleware(request: NextRequest) {
  // console.log('✅ Middleware is running'); // ← Should print now

  const { pathname } = request.nextUrl;

  // already has locale
  const pathnameHasLocale = SUPPORTED_LOCALES.some((locale) =>
    pathname.startsWith(`/${locale}`)
  );

  if (pathnameHasLocale) return NextResponse.next();

  // Redirect to default locale + default slug
  const detectedLocale = detectLocale(request);
  request.nextUrl.pathname = `/${detectedLocale}/nyc-to-ithaca`;

  return NextResponse.redirect(request.nextUrl);
}


export const config = {
  matcher: [
    '/((?!api|_next|.*\\..*).*)', // exclude /api/* and static files
  ]
};

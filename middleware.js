import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname, searchParams } = request.nextUrl

  // Allow API routes, static files, and Next.js internals always
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const cookies = request.cookies
  const previewCookie = cookies.get('torget_preview')

  // Set preview cookie if ?preview=true is in URL
  if (searchParams.get('preview') === 'true') {
    const response = NextResponse.next()
    response.cookies.set('torget_preview', '1', { maxAge: 60 * 60 * 24 }) // 24 hours
    return response
  }

  // Allow through if preview cookie is set
  if (previewCookie?.value === '1') {
    return NextResponse.next()
  }

  // Show maintenance page
  return new NextResponse(
    `<!DOCTYPE html>
<html lang="is">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Torget</title>
  <link rel="icon" href="/favicon.svg" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      color: #111;
    }
    .container { text-align: center; padding: 40px 20px; }
    .logo { font-size: 28px; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 24px; }
    h1 { font-size: 18px; font-weight: 500; color: #444; margin-bottom: 8px; }
    p { font-size: 14px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">Torget</div>
    <h1>Torget er í uppfærslu</h1>
    <p>Komdu aftur fljótlega</p>
  </div>
</body>
</html>`,
    {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    }
  )
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
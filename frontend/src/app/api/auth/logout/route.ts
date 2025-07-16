import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const protocol = request.nextUrl.protocol;
  const host = request.headers.get('host') ?? request.nextUrl.host;
  const response = NextResponse.redirect(
    new URL('/login', `${protocol}//${host}`),
  );

  response.cookies.set('session', '', { maxAge: 0 });
  return response;
}

import { jwtDecode } from 'jwt-decode';

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextFetchEvent, NextRequest } from 'next/server';

import { CustomMiddleware } from './chain';

const publicRoutes = ['login'];

function redirectToLogin(request: NextRequest) {
  const protocol = request.nextUrl.protocol;
  const host = request.headers.get('host') ?? request.nextUrl.host;
  const response = NextResponse.redirect(
    new URL('/login', `${protocol}//${host}`),
  );

  response.cookies.set({
    name: 'session',
    value: '',
    path: '/',
    maxAge: 0,
  });

  return response;
}

export function withAuthMiddleware(
  middleware: CustomMiddleware,
): CustomMiddleware {
  return async (
    request: NextRequest,
    event: NextFetchEvent,
    response: NextResponse,
  ) => {
    const path = request.nextUrl.pathname;
    const isPublicRoute = publicRoutes.some((p) => path.endsWith(p));
    const cookie = (await cookies()).get('session')?.value;

    if (isPublicRoute) return middleware(request, event, response);

    if (!cookie) {
      return redirectToLogin(request);
    }

    try {
      const decoded = jwtDecode(cookie);
      const exp = decoded?.exp ?? 0;

      if (exp < Math.floor(Date.now() / 1000)) {
        return redirectToLogin(request);
      }
    } catch {
      return redirectToLogin(request);
    }

    return middleware(request, event, response);
  };
}

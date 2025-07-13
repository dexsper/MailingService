import { NextResponse } from 'next/server';
import type { NextFetchEvent, NextRequest } from 'next/server';

import { routing } from '@/i18n/routing';
import createMiddleware from 'next-intl/middleware';

import { CustomMiddleware } from './chain';

const i18nMiddleware = createMiddleware(routing);

export function withI18nMiddleware(
  middleware: CustomMiddleware,
): CustomMiddleware {
  return async (
    request: NextRequest,
    event: NextFetchEvent,
    response: NextResponse,
  ) => {
    response = i18nMiddleware(request);
    return middleware(request, event, response);
  };
}

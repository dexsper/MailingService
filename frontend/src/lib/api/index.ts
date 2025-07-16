import { getCookie as getCookieClient } from 'cookies-next/client';
import { getCookie as getCookieServer } from 'cookies-next/server';
import createFetchClient, { Middleware } from 'openapi-fetch';
import createClient from 'openapi-react-query';

import type { paths } from './v1';

const authMiddleware: Middleware = {
  async onRequest({ request }) {
    let token: string | undefined;

    if (typeof window === 'undefined') {
      const { cookies } = await import('next/headers');
      token = await getCookieServer('session', { cookies });
    } else {
      token = getCookieClient('session');
    }

    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`);
    }

    return request;
  },
};

export const fetchClient = createFetchClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
});

fetchClient.use(authMiddleware);
export const $api = createClient(fetchClient);

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCookie } from 'cookies-next/server';

import LoginForm from '@/components/layout/forms/login';

export default async function LoginPage() {
  const session = await getCookie('session', { cookies });

  if (session) return redirect('/');

  return (
    <div className="flex h-full w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}

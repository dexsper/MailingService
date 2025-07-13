'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { setCookie } from 'cookies-next/client';

import { $api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { UserLoginState } from '@/types/user';

import { useValidationErrors } from '@/hooks/useValidationErrors';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/shared/card';

import { LoaderCircle, LogIn } from 'lucide-react';

import { Button } from '@/components/ui/shared/button';
import AutoForm from '@/components/ui/form/auto-form';
import FormErrors from '@/components/ui/form/form-error';

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter();
  const t = useTranslations('LoginPage');

  const [user, setUser] = useState<UserLoginState>({
    login: '',
    password: '',
  });

  const { mutateAsync, isPending, error } = $api.useMutation(
    'post',
    '/api/auth/signin',
  );

  const userErrors = useValidationErrors<UserLoginState>(error);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await mutateAsync({ body: user });

    setCookie('session', response.accessToken);
    router.push('/');
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>{t('Title')}</CardTitle>
          <CardDescription>{t('Description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <AutoForm
              required
              formData={user}
              setFormData={setUser}
              fieldErrors={userErrors}
              fieldProps={{
                login: {
                  type: 'email',
                  label: t('Email'),
                  placeholder: 'mail@example.com',
                },
                password: {
                  type: 'password',
                  label: t('Password'),
                  placeholder: 'Ex@mple123!',
                },
              }}
            />

            <Button
              disabled={isPending}
              type="submit"
              className="w-full cursor-pointer"
            >
              {isPending ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <LogIn />
              )}
              {t('Login')}
            </Button>

            {error && error.statusCode === 401 && (
              <FormErrors id="form" errors={[t('Incorrect')]} />
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

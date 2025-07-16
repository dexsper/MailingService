import { useMemo } from 'react';

import { useTranslations } from 'next-intl';

import { components } from '@/lib/api/v1';

type ValidationErrorResponse = components['schemas']['ValidationErrorResponse'];
type ErrorsMap<TData> = Partial<Record<keyof TData, string[]>>;

function isValidationError(err: any): err is ValidationErrorResponse {
  return (
    err &&
    typeof err === 'object' &&
    err.statusCode === 422 &&
    Array.isArray(err.errors)
  );
}

export function useValidationErrors<TData>(error: unknown) {
  const ruleTranslate = useTranslations('FieldRules');

  const errorsMap = useMemo<ErrorsMap<TData>>(() => {
    if (!isValidationError(error)) return {};

    const map: ErrorsMap<TData> = {};

    for (const e of error.errors) {
      const property = e.property as keyof TData;
      const messages = (e.messages ?? []).map((msg: string) => {
        const [key, ...args] = msg.split(' ');
        const indexedArgs = Object.fromEntries(
          args.map((arg, index) => [index, arg]),
        );

        return key ? ruleTranslate(key, indexedArgs) : '';
      });

      if (map[property]) {
        map[property]!.push(...messages);
      } else {
        map[property] = messages;
      }
    }

    return map;
  }, [error, ruleTranslate]);

  return errorsMap;
}

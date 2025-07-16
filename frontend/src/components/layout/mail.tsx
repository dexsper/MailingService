'use client';

import { useUrlState } from 'state-in-url/next';

import React, { useEffect, useRef, useState } from 'react';

import { useFormatter, useTranslations } from 'next-intl';

import { $api } from '@/lib/api';

import { mailState } from '@/types/state/mail';

import { Label } from '@/components/ui/shared/label';
import { Skeleton } from '@/components/ui/shared/skeleton';

const injectedScript = `
window.addEventListener('DOMContentLoaded', function() {
  function sendSize() {
    const body = document.body;
    const html = document.documentElement;
    const width = Math.max(body.scrollWidth, html.scrollWidth, body.offsetWidth, html.offsetWidth);
    const height = Math.max(body.scrollHeight, html.scrollHeight, body.offsetHeight, html.offsetHeight);
    window.parent.postMessage({ type: 'mail-iframe-size', width, height }, '*');
  }
  sendSize();
  window.addEventListener('resize', sendSize);
  setTimeout(sendSize, 100);
});
`;

export default function MailView() {
  const format = useFormatter();
  const t = useTranslations('Mail');

  const { urlState } = useUrlState(mailState);

  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [scale, setScale] = useState(1);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const { data, isLoading } = $api.useQuery(
    'get',
    '/api/mailbox/messages/get/{messageId}',
    {
      params: {
        path: {
          messageId: urlState.uid,
        },
      },
    },
    {
      enabled: urlState.uid > 0,
    },
  );

  useEffect(() => {
    if (!iframeLoaded) return;
    function handleMessage(event: MessageEvent) {
      if (event.data && event.data.type === 'mail-iframe-size') {
        const { width, height } = event.data;
        const container = containerRef.current;
        if (container) {
          const scaleW = container.offsetWidth / width;
          const scaleH = container.offsetHeight / height;

          const scaleFactor = 1.2;
          const avgScale = (scaleW + scaleH) / 2;

          setScale(Math.min(avgScale * scaleFactor, 1));
        }
      }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [iframeLoaded]);

  useEffect(() => {
    if (!data) return;

    setScale(1);
    setIframeLoaded(false);
  }, [data]);

  if (isLoading) return <Skeleton className="w-full h-full rounded-none" />;

  if (!data) {
    return <></>;
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full border p-2 relative overflow-hidden flex flex-col min-h-0"
    >
      <div className="flex flex-col gap-3 p-4 mb-4 rounded-md border bg-card">
        <Label className="text-xl font-bold">{data.subject}</Label>
        <div className="flex flex-col gap-2">
          <Label>
            {t('From')} {data.from}
          </Label>
          <Label>
            {t('To')} {data.to}
          </Label>
          <Label>
            {t('Date')}{' '}
            {format.dateTime(new Date(data.date), {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </Label>
        </div>
      </div>
      <div className="flex-1 min-h-0 w-full relative">
        <iframe
          ref={iframeRef}
          title="Email preview"
          className="border-none rounded-md overflow-hidden w-full h-full min-h-0 absolute left-0 top-0"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: scale !== 1 ? `${100 / scale}%` : '100%',
            height: scale !== 1 ? `${100 / scale}%` : '100%',
          }}
          srcDoc={`<script>${injectedScript}<\/script>${data.htmlBody}`}
          onLoad={() => setIframeLoaded(true)}
        />
      </div>
    </div>
  );
}

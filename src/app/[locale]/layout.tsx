import { getDirection } from '@/i18n/direction';
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';
import '../globals.css';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import React from 'react';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Medical Pill Game',
  description: 'Medical Pill Sorting Game',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html
      lang={locale}
      dir={getDirection(locale)}
      className={getDirection(locale)}
    >
      <body>
        <Toaster richColors closeButton duration={5000} position="top-left" />
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}

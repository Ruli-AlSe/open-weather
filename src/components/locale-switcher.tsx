'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';

import { Locale } from '@/i18n/config';
import { setUserLocale } from '@/lib/services/locale';
import clsx from 'clsx';

export const LocaleSwitcher = () => {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const onChange = (value: string) => {
    const locale = value as Locale;
    startTransition(() => {
      setUserLocale(locale);
    });
  };

  return (
    <div className="w-full max-w-4xl text-black flex gap-5 mt-10 items-center px-3">
      <span className="text-white">{t('label')}</span>
      <select
        className={clsx(
          'relative py-2 px-3 text-lg rounded transition-colors hover:bg-slate-200 flex justify-between',
          {
            'pointer-events-none opacity-60': isPending,
          }
        )}
        defaultValue={locale}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="en" className="flex justify-between w-full text-lg">
          {t('en')} 🇺🇸
        </option>
        <option value="es" className="flex justify-between w-full text-lg">
          {t('es')} 🇲🇽
        </option>
        <option value="zh" className="flex justify-between w-full text-lg">
          {t('zh')} 🇨🇳
        </option>
      </select>
    </div>
  );
};

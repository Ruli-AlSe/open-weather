'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useState, useTransition } from 'react';
import clsx from 'clsx';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

import { Locale } from '@/i18n/config';
import { setUserLocale } from '@/lib/services/locale';
import { handleKeyPress } from '@/lib/utils';

export const LocaleSwitcher = () => {
  const t = useTranslations('LocaleSwitcher');
  const [openDialog, setOpenDialog] = useState(false);
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const langs = [
    {
      value: 'en',
      label: t('en'),
      icon: '🇺🇸',
    },
    {
      value: 'es',
      label: t('es'),
      icon: '🇲🇽',
    },
    {
      value: 'zh',
      label: t('zh'),
      icon: '🇨🇳',
    },
  ];

  const onChange = (value: string) => {
    const locale = value as Locale;
    startTransition(() => {
      setUserLocale(locale);
      setOpenDialog(false);
    });
  };

  return (
    <>
      <h3 id="language-selector-label" className="text-lg font-medium">
        {t('label')}
      </h3>
      <div className="relative mt-2 w-1/2 sm:w-40">
        <button
          id="language-selector-button"
          className="w-full flex justify-between items-center rounded-md bg-white py-2 px-3 text-left text-gray-900"
          onClick={() => setOpenDialog(!openDialog)}
          aria-expanded={openDialog}
          aria-haspopup="listbox"
          aria-labelledby="language-selector-label"
          aria-controls="language-selector-options"
        >
          <span className="flex items-center gap-3 pr-6">
            {langs.find((lang) => lang.value === locale)?.icon}
            <span className="block truncate font-normal">
              {langs.find((lang) => lang.value === locale)?.label}
            </span>
          </span>

          <ChevronUpDownIcon
            aria-hidden="true"
            className="size-5 self-center justify-self-end text-gray-500 sm:size-4"
          />
        </button>
        {openDialog && (
          <ul
            id="language-selector-options"
            role="listbox"
            aria-labelledby="language-selector-label"
            className="w-full absolute z-10 mt-1 max-h-56 overflow-auto rounded-md bg-white shadow-lg ring-black/5 focus:outline-hidden"
          >
            {langs.map((lang) => (
              <li
                key={lang.value}
                role="option"
                aria-selected={locale === lang.value}
                className={clsx(
                  'relative flex justify-between cursor-default py-2 px-3 text-gray-900 hover:bg-orange-500 hover:text-black',
                  {
                    'pointer-events-none opacity-60': isPending,
                  }
                )}
                onClick={() => onChange(lang.value)}
                onKeyDown={(event) => handleKeyPress(event, () => onChange(lang.value))}
                tabIndex={0}
              >
                <div className="flex items-center">
                  <span className="ml-3 block truncate font-normal" aria-hidden="true">
                    {lang.icon}
                  </span>
                  <span className="ml-3 block truncate font-normal">{lang.label}</span>
                </div>
                {lang.value === locale && <CheckIcon aria-hidden="true" className="size-5" />}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

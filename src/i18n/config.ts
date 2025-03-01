export type Locale = (typeof locales)[number];

export const locales = ['en', 'es', 'zh'] as const;
export const defaultLocale: Locale = 'en';

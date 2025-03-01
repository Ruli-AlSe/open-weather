'use server';

import { getTranslations } from 'next-intl/server';

import { City } from '@/lib/definitions/requests';

export const searchCityLocation = async (query: string) => {
  const apiUrl = process.env.WEATHERAPP_API_URL;
  const apiKey = process.env.WEATHERAPP_API_KEY;
  const t = await getTranslations('ActionErrors');

  try {
    if (!apiUrl || !apiKey) {
      throw new Error(t('missingApiKey'));
    }

    const response = await fetch(`${apiUrl}/geo/1.0/direct?q=${query}&limit=10&appid=${apiKey}`);
    const data: City[] = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw new Error(t('searchCityLocationError'));
  }
};

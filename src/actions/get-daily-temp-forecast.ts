'use server';

import { getTranslations } from 'next-intl/server';

import { Units } from '@/lib/definitions/requests';
import { convertToDailyTempForecast } from '@/lib/utils';

export const getDailyTempForecast = async (
  lat: number,
  lon: number,
  units: keyof Units = 'metric'
) => {
  const apiUrl = process.env.WEATHERAPP_API_URL;
  const apiKey = process.env.WEATHERAPP_API_KEY;
  const t = await getTranslations('ActionErrors');

  try {
    if (!apiUrl || !apiKey) {
      throw new Error(t('missingApiKey'));
    }
    const forecastRes = await fetch(
      `${apiUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`
    );
    const forecastData = await forecastRes.json();

    const dailyTempForecast = convertToDailyTempForecast(forecastData.list);

    return dailyTempForecast;
  } catch (error) {
    console.error(error);
    throw new Error(t('getDailyTempForecastError'));
  }
};

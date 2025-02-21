'use server';

import { convertToDailyTempForecast } from '@/lib/utils';

export const getDailyTempForecast = async (lat: number, lon: number) => {
  const apiUrl = process.env.WEATHERAPP_API_URL;
  const apiKey = process.env.WEATHERAPP_API_KEY;

  try {
    if (!apiUrl || !apiKey) {
      throw new Error('API URL or API key is missing');
    }
    const forecastRes = await fetch(
      `${apiUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );
    const forecastData = await forecastRes.json();

    const dailyTempForecast = convertToDailyTempForecast(forecastData.list);

    return dailyTempForecast;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

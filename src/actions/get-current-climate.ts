'use server';

import { Climate, Units } from '@/lib/definitions/requests';

export const getCurrentClimate = async (
  lat: number,
  lon: number,
  units: keyof Units = 'metric'
) => {
  const apiUrl = process.env.WEATHERAPP_API_URL;
  const apiKey = process.env.WEATHERAPP_API_KEY;

  try {
    if (!apiUrl || !apiKey) {
      throw new Error('API URL or API key is missing');
    }

    const response = await fetch(
      `${apiUrl}/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`
    );
    const data: Climate = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch current weather information');
  }
};

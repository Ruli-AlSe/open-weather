'use server';

import { Climate } from '@/lib/definitions';

export const getCurrentClimate = async (lat: number, lon: number) => {
  const apiUrl = process.env.WEATHERAPP_API_URL;
  const apiKey = process.env.WEATHERAPP_API_KEY;

  try {
    if (!apiUrl || !apiKey) {
      throw new Error('API URL or API key is missing');
    }

    const response = await fetch(
      `${apiUrl}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );
    const data: Climate = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

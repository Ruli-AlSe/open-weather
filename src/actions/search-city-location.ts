'use server';

import { City } from '@/lib/definitions/requests';

export const searchCityLocation = async (query: string) => {
  const apiUrl = process.env.WEATHERAPP_API_URL;
  const apiKey = process.env.WEATHERAPP_API_KEY;

  try {
    if (!apiUrl || !apiKey) {
      throw new Error('API URL or API key is missing');
    }

    const response = await fetch(`${apiUrl}/geo/1.0/direct?q=${query}&limit=10&appid=${apiKey}`);
    const data: City[] = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

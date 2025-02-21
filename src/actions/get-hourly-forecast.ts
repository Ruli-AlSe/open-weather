'use server';

import { apiDateFormat, convert3hrForecastToHourlyForecast } from '@/lib/utils';
import { getCurrentClimate } from './get-current-climate';

export const getForecast = async (lat: number, lon: number) => {
  const apiUrl = process.env.WEATHERAPP_API_URL;
  const apiKey = process.env.WEATHERAPP_API_KEY;

  try {
    if (!apiUrl || !apiKey) {
      throw new Error('API URL or API key is missing');
    }
    const [forecastRes, currentWeatherRes] = await Promise.all([
      fetch(`${apiUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=8&units=metric&appid=${apiKey}`),
      getCurrentClimate(lat, lon),
    ]);
    const forcastData = await forecastRes.json();

    if (currentWeatherRes === undefined) {
      return undefined;
    }

    const hourlyForecast = convert3hrForecastToHourlyForecast([
      { dt_txt: apiDateFormat(new Date()), main: currentWeatherRes.main },
      ...forcastData.list,
    ]);

    return hourlyForecast;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

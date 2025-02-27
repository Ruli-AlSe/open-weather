'use server';

import { apiDateFormat, convert3hrForecastToHourlyForecast } from '@/lib/utils';
import { getCurrentClimate } from './get-current-climate';
import { Units } from '@/lib/definitions/requests';

export const getHourlyForecast = async (
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
    const [forecastRes, currentWeatherRes] = await Promise.all([
      fetch(
        `${apiUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=8&units=${units}&appid=${apiKey}`
      ),
      getCurrentClimate(lat, lon, units),
    ]);
    const forcastData = await forecastRes.json();

    const hourlyForecast = convert3hrForecastToHourlyForecast([
      { dt_txt: apiDateFormat(new Date()), main: currentWeatherRes.main },
      ...forcastData.list,
    ]);

    return hourlyForecast;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch hourly forecast information');
  }
};

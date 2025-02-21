'use client';

import { useEffect, useState } from 'react';

import { getHourlyForecast } from '@/actions/get-hourly-forecast';
import { TempForecast } from '@/lib/definitions/requests';
import { Subtitle } from './ui/subtitle';
import { Card } from './ui/card';
import { useErrorStore, useCityStore } from '@/stores';

export const HourlyForecast = () => {
  const activeCity = useCityStore((state) => state.activeCity);
  const [forecast, setForecast] = useState<TempForecast[]>([]);
  const setError = useErrorStore((state) => state.setError);

  useEffect(() => {
    const getClimate = async () => {
      if (!activeCity) {
        return;
      }

      const { lat, lon } = activeCity;
      try {
        const res = await getHourlyForecast(lat, lon);
        setForecast(res);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Unknown error');
        }
      }
    };

    getClimate();
  }, [activeCity]);

  if (!forecast.length) {
    return null;
  }

  return (
    <section className="flex flex-col gap-5 fade-in-component">
      <Subtitle text="Forecast for next 24 hrs" />

      <div id="forecast-wrapper" className="w-full flex gap-5 overflow-x-scroll py-5">
        {forecast.map(({ dt_txt, temp }) => {
          const [date, time] = dt_txt.split('-');
          return (
            <Card key={dt_txt} title={date} timeStr={time}>
              <p className="text-3xl my-7 font-extrabold">{temp?.toFixed(1)} ºC</p>
              <p>{time}</p>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

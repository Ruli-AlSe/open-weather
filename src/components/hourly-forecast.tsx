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
  }, [activeCity, setError]);

  if (!forecast.length) {
    return null;
  }

  return (
    <section
      className="flex flex-col gap-5 fade-in-component"
      aria-label={`Hourly weather forecast for ${activeCity?.name}, ${activeCity?.country}`}
    >
      <Subtitle text="Forecast for next 24 hrs" />

      <div
        id="hourly-forecast-wrapper"
        className="w-full flex gap-5 overflow-x-scroll py-5"
        role="region"
        aria-label="Hourly temperature forecast scrollable content"
        tabIndex={0}
      >
        {forecast.map(({ dt_txt, temp }) => {
          const [date, time] = dt_txt.split('-');
          return (
            <Card
              key={dt_txt}
              title={date}
              timeStr={time}
              aria-label={`Weather forecast for ${date} at ${time}`}
            >
              <p
                className="text-3xl my-7 font-extrabold"
                aria-label={`Temperature: ${temp?.toFixed(1)} degrees Celsius`}
              >
                {temp?.toFixed(1)} ºC
              </p>
              <p aria-label={`Time: ${time}`}>{time}</p>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

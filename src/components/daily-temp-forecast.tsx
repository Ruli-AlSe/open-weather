'use client';

import { useEffect, useState } from 'react';

import { TempForecast } from '@/lib/definitions/requests';
import { getDailyTempForecast } from '@/actions/get-daily-temp-forecast';
import { Subtitle } from './ui/subtitle';
import { Card } from './ui/card';
import { useErrorStore, useCityStore } from '@/stores';
import { formatTemperature } from '@/lib/utils';

export const DailyTempForecast = () => {
  const { activeCity, units } = useCityStore((state) => state);
  const [forecast, setForecast] = useState<TempForecast[]>([]);
  const setError = useErrorStore((state) => state.setError);

  useEffect(() => {
    const getClimate = async () => {
      if (!activeCity) {
        return;
      }

      const { lat, lon } = activeCity;
      try {
        const res = await getDailyTempForecast(lat, lon, units);
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
  }, [activeCity, units, setError]);

  if (!forecast.length) {
    return null;
  }

  return (
    <section
      className="flex flex-col gap-5 fade-in-component"
      aria-label={`Daily temperature forecast for ${activeCity?.name}, ${activeCity?.country}`}
    >
      <Subtitle text="Forecast max/min temp for the rest of the week" />

      <div
        id="daily-temp-forecast-wrapper"
        className="w-full flex gap-5 overflow-x-scroll py-5"
        role="region"
        aria-label="Daily temperature forecast scrollable content"
        tabIndex={0}
      >
        {forecast.map(({ dt_txt, temp_max, temp_min }) => (
          <Card key={dt_txt} title={dt_txt} aria-label={`Weather forecast for ${dt_txt}`}>
            <p
              className="text-3xl my-4 font-extrabold flex flex-col items-center"
              aria-label={`Maximum temperature: ${formatTemperature(
                temp_max!,
                units
              )} ${units} degrees`}
            >
              <span className="text-sm">Max temp.</span>
              <span>{formatTemperature(temp_max!, units)}</span>
            </p>
            <p
              className="text-3xl my-4 font-extrabold flex flex-col items-center"
              aria-label={`Minimum temperature: ${formatTemperature(
                temp_min!,
                units
              )} ${units} degrees`}
            >
              <span className="text-sm">Min temp.</span>
              <span>{formatTemperature(temp_min!, units)}</span>
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
};

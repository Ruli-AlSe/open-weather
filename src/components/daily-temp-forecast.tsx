'use client';

import { useEffect, useState } from 'react';

import { TempForecast } from '@/lib/definitions/requests';
import { getDailyTempForecast } from '@/actions/get-daily-temp-forecast';
import { Subtitle } from './ui/subtitle';
import { Card } from './ui/card';
import { useErrorStore, useCityStore } from '@/stores';

export const DailyTempForecast = () => {
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
        const res = await getDailyTempForecast(lat, lon);
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
          <Card 
            key={dt_txt} 
            title={dt_txt}
            aria-label={`Weather forecast for ${dt_txt}`}
          >
            <p 
              className="text-3xl my-4 font-extrabold flex flex-col items-center"
              aria-label={`Maximum temperature: ${temp_max?.toFixed(1)} degrees Celsius`}
            >
              <span className="text-sm">Max temp.</span>
              <span>{temp_max?.toFixed(1)} ºC</span>
            </p>
            <p 
              className="text-3xl my-4 font-extrabold flex flex-col items-center"
              aria-label={`Minimum temperature: ${temp_min?.toFixed(1)} degrees Celsius`}
            >
              <span className="text-sm">Min temp.</span>
              <span>{temp_min?.toFixed(1)} ºC</span>
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
};

'use client';

import { useEffect, useState } from 'react';

import { useCityStore } from '@/stores/use-city-store';
import { TempForecast } from '@/lib/definitions/requests';
import { getDailyTempForecast } from '@/actions/get-daily-temp-forecast';
import { Subtitle } from './ui/subtitle';

export const DailyTempForecast = () => {
  const activeCity = useCityStore((state) => state.activeCity);
  const [forecast, setForecast] = useState<TempForecast[]>([]);

  useEffect(() => {
    const getClimate = async () => {
      if (!activeCity) {
        return;
      }

      const { lat, lon } = activeCity;
      const res = await getDailyTempForecast(lat, lon);
      if (res) {
        setForecast(res);
      }
    };

    getClimate();
  }, [activeCity]);

  if (!forecast.length) {
    return null;
  }

  return (
    <section className="flex flex-col gap-5 fade-in-component">
      <Subtitle text="Forecast max/min temp for the rest of the week" />

      <div id="forecast-wrapper" className="w-full flex gap-5 overflow-x-scroll py-5">
        {forecast.map(({ dt_txt, temp_max, temp_min }) => (
          <div
            key={dt_txt}
            className="flex flex-col items-center p-3 bg-slate-500 rounded text-white"
          >
            <p className="w-40">{dt_txt}</p>
            <p className="text-3xl my-4 font-extrabold flex flex-col items-center">
              <span className="text-sm">Max temp.</span>
              <span>{temp_max?.toFixed(1)} ºC</span>
            </p>
            <p className="text-3xl my-4 font-extrabold flex flex-col items-center">
              <span className="text-sm">Min temp.</span>
              <span>{temp_min?.toFixed(1)} ºC</span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

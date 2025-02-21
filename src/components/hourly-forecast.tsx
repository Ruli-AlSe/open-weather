'use client';

import { useEffect, useState } from 'react';

import { useCityStore } from '@/stores/use-city-store';
import { getForecast } from '@/actions/get-hourly-forecast';
import { HourlyTemp } from '@/lib/definitions';

export const HourlyForecast = () => {
  const activeCity = useCityStore((state) => state.activeCity);
  const [forecast, setForecast] = useState<HourlyTemp[]>([]);

  useEffect(() => {
    const getClimate = async () => {
      if (!activeCity) {
        return;
      }

      const { lat, lon } = activeCity;
      const res = await getForecast(lat, lon);
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
    <section className="flex flex-col gap-5">
      <h2 className="text-2xl font-bold mb-4">Forecast for nex 24 hrs</h2>

      <div id="forecast-wrapper" className="w-full flex gap-5 overflow-x-scroll py-10">
        {forecast.map(({ dt_txt, temp }) => {
          const [date, time] = dt_txt.split('-');
          return (
            <div
              key={dt_txt}
              className="flex flex-col items-center p-3 bg-slate-500 rounded text-white"
            >
              <p className="w-40">{date}</p>
              <p className="text-3xl my-7 font-extrabold">{temp.toFixed(1)} ºC</p>
              <p>{time}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

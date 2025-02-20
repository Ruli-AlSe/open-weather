'use client';

import { useEffect, useState } from 'react';

import { getCurrentClimate } from '@/actions/get-current-climate';
import { Climate } from '@/lib/definitions';
import { useCityStore } from '@/stores/use-city-store';
import Image from 'next/image';

const paragraphClasses = 'text-xl mb-3';

export const WeatherInfo = () => {
  const activeCity = useCityStore((state) => state.activeCity);
  const [climate, setClimate] = useState<Climate | undefined>();

  useEffect(() => {
    const getClimate = async () => {
      if (!activeCity) {
        setClimate(undefined);
        return;
      }

      const { lat, lon } = activeCity;
      const res = await getCurrentClimate(lat, lon);
      setClimate(res);
    };

    getClimate();
  }, [activeCity]);

  if (!climate || !activeCity) {
    return null;
  }

  const { name, country } = activeCity;
  const {
    main: { feels_like, humidity, temp, temp_max, temp_min },
    weather,
  } = climate;
  const weatherDescription = weather.map((w) => w.description).join(', ');

  return (
    <section id="weather-info-section" className="px-5">
      <h2 className="text-3xl mb-3">
        Weather info for {name}, {country}
      </h2>

      <div className={`${paragraphClasses} flex items-center`}>
        <Image
          src={`https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`}
          alt={weatherDescription}
          width={45}
          height={45}
        />
        Feels like {feels_like} ºC, with {weatherDescription}.
      </div>
      <p className={paragraphClasses}>Temperature: {temp} ºC</p>
      <p className={paragraphClasses}>
        Max/Min temp: {temp_max} ºC / {temp_min} ºC
      </p>
      <p className={paragraphClasses}>Humidity: {humidity}%</p>
    </section>
  );
};

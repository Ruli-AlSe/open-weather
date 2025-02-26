'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import { getCurrentClimate } from '@/actions/get-current-climate';
import { Climate } from '@/lib/definitions/requests';
import { useCityStore, useErrorStore } from '@/stores';
import { Button } from './ui/button';
import { saveActiveCityToLocalStorage } from '@/lib/utils';

const paragraphClasses = 'text-xl mb-3';

export const WeatherInfo = () => {
  const activeCity = useCityStore((state) => state.activeCity);
  const addFavCities = useCityStore((state) => state.addFavCities);
  const favCities = useCityStore((state) => state.favCities);
  const setError = useErrorStore((state) => state.setError);
  const [climate, setClimate] = useState<Climate | undefined>();
  const addCityToFav = () => {
    saveActiveCityToLocalStorage(activeCity!);
    addFavCities([activeCity!]);
  };

  useEffect(() => {
    const getClimate = async () => {
      if (!activeCity) {
        setClimate(undefined);
        return;
      }

      const { lat, lon } = activeCity;

      try {
        const res = await getCurrentClimate(lat, lon);
        setClimate(res);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setError(errorMessage);
      }
    };

    getClimate();
  }, [activeCity, setError]);

  if (!climate || !activeCity) {
    return null;
  }

  const { name, country } = activeCity;
  const {
    main: { feels_like, humidity, temp, temp_max, temp_min },
    coord,
    weather,
    id,
  } = climate;
  const weatherDescription = weather.map((w) => w.description).join(', ');

  return (
    <section
      id="weather-info-section"
      className="px-5 fade-in-component"
      aria-label={`Current weather information for ${name}, ${country}`}
    >
      <div className="container flex flex-col" role="region" aria-label="Weather details">
        <div className="w-full">
          <h1 className="text-3xl mb-3" tabIndex={0}>
            Weather info for{' '}
            <span
              className="bg-gradient-to-r from-orange-600 to-orange-300 text-transparent bg-clip-text font-extrabold"
              aria-label={`${name}, ${country}`}
            >
              {name}, {country}
            </span>
          </h1>

          <div
            className={`${paragraphClasses} flex items-center`}
            aria-label="Current weather conditions"
          >
            <Image
              src={`https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`}
              alt={`Weather icon for ${weatherDescription}`}
              width={45}
              height={45}
            />
            <span aria-live="polite">
              Feels like {feels_like} ºC, with {weatherDescription}.
            </span>
          </div>
          <p className={paragraphClasses} aria-label="Current temperature" tabIndex={0}>
            Temperature: {temp} ºC
          </p>
          <p className={paragraphClasses} aria-label="Temperature range" tabIndex={0}>
            Max/Min temp: {temp_max} ºC / {temp_min} ºC
          </p>
          <p className={paragraphClasses} aria-label="Humidity level" tabIndex={0}>
            Humidity: {humidity}%
          </p>
        </div>

        <div
          className="flex flex-col lg:flex-row justify-between gap-5 mt-5"
          role="group"
          aria-label="Weather actions"
        >
          <Button
            text="Fav city"
            buttonType="button"
            iconUrl="/fav-icon.svg"
            disabled={favCities.some(
              (city) =>
                city.lat.toFixed(3) === coord.lat.toFixed(3) &&
                city.lon.toFixed(3) === coord.lon.toFixed(3)
            )}
            action={addCityToFav}
            extraClasses="bg-gradient-to-r from-blue-500 to-blue-400 duration-300 hover:to-blue-600 text-xl rounded-lg font-bold px-5"
            aria-label={`Add ${name}, ${country} to favorites`}
          />
          <Button
            text="See more info"
            buttonType="external-link"
            iconUrl="/external-link.svg"
            href={`https://openweathermap.org/city/${id}`}
            extraClasses="bg-gradient-to-r from-orange-500 to-orange-300 duration-300 hover:to-orange-600 text-xl rounded-lg font-bold"
            aria-label={`View detailed weather information for ${name}, ${country} on OpenWeatherMap`}
          />
        </div>
      </div>
    </section>
  );
};

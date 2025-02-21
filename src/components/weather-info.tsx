'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import { getCurrentClimate } from '@/actions/get-current-climate';
import { Climate } from '@/lib/definitions/requests';
import { useCityStore, useErrorStore } from '@/stores';
import { Button } from './ui/button';

const paragraphClasses = 'text-xl mb-3';

export const WeatherInfo = () => {
  const activeCity = useCityStore((state) => state.activeCity);
  const addFavCities = useCityStore((state) => state.addFavCities);
  const favCities = useCityStore((state) => state.favCities);
  const setError = useErrorStore((state) => state.setError);
  const [climate, setClimate] = useState<Climate | undefined>();
  const addCityToFav = () => {
    if (!activeCity) {
      return;
    }
    const localStorageCities = localStorage.getItem('fav-cities');
    if (!localStorageCities) {
      localStorage.setItem('fav-cities', JSON.stringify([activeCity]));
    } else {
      const favCities = JSON.parse(localStorageCities);
      favCities.push(activeCity);
      localStorage.setItem('fav-cities', JSON.stringify(favCities));
    }
    addFavCities([activeCity]);
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
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Unknown error');
        }
      }
    };

    getClimate();
  }, [activeCity]);

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
    <section id="weather-info-section" className="px-5 fade-in-component">
      <div className="container flex flex-col">
        <div className="w-full">
          <h2 className="text-3xl mb-3">
            Weather info for{' '}
            <span className="bg-gradient-to-r from-orange-600 to-orange-300 text-transparent bg-clip-text font-extrabold">
              {name}, {country}
            </span>
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
        </div>

        <div className="flex flex-col lg:flex-row justify-between gap-5 mt-5">
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
          />
          <Button
            text="See more info"
            buttonType="external-link"
            iconUrl="/external-link.svg"
            href={`https://openweathermap.org/city/${id}`}
            extraClasses="bg-gradient-to-r from-orange-500 to-orange-300 duration-300 hover:to-orange-600 text-xl rounded-lg font-bold"
          />
        </div>
      </div>
    </section>
  );
};

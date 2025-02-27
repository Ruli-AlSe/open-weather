'use client';

import Image from 'next/image';

import { Button } from './ui/button';
import { formatTemperature } from '@/lib/utils';
import { useWeatherInfo } from '@/hooks';

const paragraphClasses = 'text-xl mb-3';

export const WeatherInfo = () => {
  const { climate, favCities, activeCity, units, addCityToFav } = useWeatherInfo();

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
              Feels like {formatTemperature(feels_like, units)}, with {weatherDescription}.
            </span>
          </div>
          <p className={paragraphClasses} aria-label="Current temperature" tabIndex={0}>
            Temperature: {formatTemperature(temp, units)}
          </p>
          <p className={paragraphClasses} aria-label="Temperature range" tabIndex={0}>
            Max/Min temp: {formatTemperature(temp_max, units)} /{' '}
            {formatTemperature(temp_min, units)}
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
                city.lat.toFixed(2) === coord.lat.toFixed(2) &&
                city.lon.toFixed(2) === coord.lon.toFixed(2)
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

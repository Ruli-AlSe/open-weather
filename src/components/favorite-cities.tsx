'use client';

import { useEffect } from 'react';

import { City } from '@/lib/definitions/requests';
import { useCityStore } from '@/stores/use-city-store';
import { Subtitle } from './ui/subtitle';
import { Button } from './ui/button';

export const FavoriteCities = () => {
  const favCities = useCityStore((state) => state.favCities);
  const addFavCities = useCityStore((state) => state.addFavCities);
  const removeFavCity = useCityStore((state) => state.removeFavCity);
  const setActiveCity = useCityStore((state) => state.setActiveCity);
  const removeCity = (lat: number, lon: number) => {
    const localStorageCities = localStorage.getItem('fav-cities');
    if (localStorageCities) {
      const parsedFavCities = JSON.parse(localStorageCities) as City[];
      const newFavCities = parsedFavCities.filter((city) => city.lat !== lat && city.lon !== lon);
      localStorage.setItem('fav-cities', JSON.stringify(newFavCities));
    }
    removeFavCity(lat, lon);
  };

  useEffect(() => {
    const localStorageCities = localStorage.getItem('fav-cities');
    if (!localStorageCities) {
      return;
    }
    const parsedFavCities = JSON.parse(localStorageCities) as City[];
    addFavCities(parsedFavCities);
  }, [addFavCities]);

  return (
    <section className="px-5">
      <Subtitle text="Favorite Cities" />

      <div
        id="favorite-cities"
        className="px-1 grid grid-cols-1 gap-4 text-white max-h-60 md:max-h-[26rem] overflow-y-scroll"
      >
        {!favCities.length && <p>No favorite cities added yet.</p>}
        {favCities.map(({ lat, lon, name, country, state }, idx) => {
          return (
            <div
              key={`${lat} - ${lon} - ${idx}`}
              data-testid="favorite-city"
              className="flex flex-col justify-between bg-gradient-to-r from-blue-500 to-blue-400 hover:to-blue-600 rounded-lg shadow-md p-4 rise-up-component"
            >
              <div
                className="mb-5 hover:cursor-pointer"
                onClick={() => setActiveCity({ lat, lon, name, country, state })}
              >
                <h3 className="text-xl font-bold">{name}</h3>
                <p className="text-gray-200">{`${state}, ${country}`}</p>
              </div>

              <Button
                text="Remove fav"
                buttonType="button"
                action={() => removeCity(lat, lon)}
                extraClasses="w-fit bg-red-500 duration-300 hover:bg-red-700 text-sm rounded-lg font-bold"
                testId={`remove-fav-city-${name}-${state}-${country}`}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};

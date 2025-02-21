'use client';

import { useEffect } from 'react';

import { City } from '@/lib/definitions';
import { useCityStore } from '@/stores/use-city-store';

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
      <h2 className="text-2xl font-bold mb-4">Favorite Cities</h2>
      <div
        id="favorite-cities"
        className="px-1 grid grid-cols-1 gap-4 text-white max-h-60 md:max-h-50 overflow-y-scroll hover:cursor-pointer"
      >
        {!favCities.length && <p>No favorite cities added yet.</p>}
        {favCities.map(({ lat, lon, name, country, state }, idx) => {
          return (
            <div
              key={`${lat} - ${lon} - ${idx}`}
              className="flex flex-col justify-between bg-gradient-to-r from-blue-500 to-blue-400 hover:to-blue-600 rounded-lg shadow-md p-4"
              onClick={() => setActiveCity({ lat, lon, name, country, state })}
            >
              <div>
                <h3 className="text-xl font-bold">{name}</h3>
                <p className="text-gray-200">{`${state}, ${country}`}</p>
              </div>
              <button
                onClick={() => removeCity(lat, lon)}
                className="w-fit px-2 py-1 mt-3 bg-red-500 duration-300 hover:bg-red-700 text-sm rounded-lg font-bold"
              >
                Remove fav
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

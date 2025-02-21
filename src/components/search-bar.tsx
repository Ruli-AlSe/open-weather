'use client';

import { useEffect, useState } from 'react';

import { debounce } from '@/lib/utils';
import { searchCityLocation } from '@/actions/search-city-location';
import { City } from '@/lib/definitions/requests';
import { Subtitle } from './ui/subtitle';
import { useErrorStore, useCityStore } from '@/stores';

export const SearchBar = () => {
  const [location, setLocation] = useState<string>('');
  const [cities, setCities] = useState<City[] | undefined>();
  const setError = useErrorStore((state) => state.setError);
  const setActiveCity = useCityStore((state) => state.setActiveCity);
  const processChange = debounce((value: string) => setLocation(value));

  const selectActiveCity = (city: City) => {
    setActiveCity(city);
    setLocation('');
  };

  useEffect(() => {
    const getCities = async () => {
      try {
        const res = await searchCityLocation(location);
        setCities(res);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Unknown error');
        }
      }
    };

    if (location.length > 0) {
      getCities();
    } else {
      setCities(undefined);
    }
  }, [location]);

  return (
    <section id="search-bar-section" className="md:px-3 mt-10 flex justify-center gap-3">
      <div className="w-full relative">
        <Subtitle text="Search for any city in the world and click on it" />

        <input
          className="w-full p-1 md:p-3 text-xl md:rounded-lg text-black"
          type="text"
          placeholder="Enter location"
          onChange={(e) => processChange(e.target.value)}
        />
        {cities?.length === 0 && (
          <p className="p-4 text-red-500">No results found for &quot; {location} &quot;</p>
        )}
        {cities && (
          <div className="absolute z-10 w-full max-h-96 overflow-y-auto bg-white md:rounded-lg shadow-md top-[105%] md:top-[130px] lg:top-[100px]">
            {cities.map((city, idx) => (
              <p
                key={`${city.lat} - ${city.lon} - ${idx}`}
                className="cursor-pointer text-black hover:bg-gray-100 px-4 py-2"
                onClick={() => selectActiveCity(city)}
              >
                {city.name}, {city.state}, {city.country}
              </p>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

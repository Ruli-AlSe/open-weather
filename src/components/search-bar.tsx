'use client';

import { useEffect, useState } from 'react';

import { debounce } from '@/lib/utils';
import { searchCityLocation } from '@/actions/search-city-location';
import { City } from '@/lib/definitions';

export const SearchBar = () => {
  const [location, setLocation] = useState<string>('');
  const [cities, setCities] = useState<City[] | undefined>();
  const processChange = debounce((value: string) => setLocation(value));

  useEffect(() => {
    const getCities = async () => {
      const res = await searchCityLocation(location);
      setCities(res);
    };

    if (location.length > 0) {
      getCities();
    } else {
      setCities(undefined);
    }
  }, [location]);

  return (
    <div className="w-full px-3 max-w-4xl mt-10 flex justify-center gap-3">
      <div className="w-full relative">
        <input
          className="w-full p-1 md:p-3 text-xl rounded-xl text-black"
          type="text"
          placeholder="Enter location"
          onChange={(e) => processChange(e.target.value)}
        />
        {cities && (
          <div className="absolute z-10 w-full max-h-96 overflow-y-auto bg-white rounded-lg shadow-md top-16">
            {cities.map((city) => (
              <div
                key={city.lat + city.lon}
                className="cursor-pointer text-black hover:bg-gray-100 px-4 py-2"
              >
                {city.name}, {city.state}, {city.country}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

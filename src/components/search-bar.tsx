'use client';

import { useEffect, useState, KeyboardEvent } from 'react';
import clsx from 'clsx';

import { debounce } from '@/lib/utils';
import { searchCityLocation } from '@/actions/search-city-location';
import { City, Units } from '@/lib/definitions/requests';
import { Subtitle } from './ui/subtitle';
import { useErrorStore, useCityStore } from '@/stores';
import { RadioButtons } from './ui/radio-buttons';

export const SearchBar = () => {
  const [location, setLocation] = useState<string>('');
  const [cities, setCities] = useState<City[] | undefined>();
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const setError = useErrorStore((state) => state.setError);
  const { setActiveCity, setUnits, units } = useCityStore((state) => state);
  const processLocationChange = debounce((value: string) => setLocation(value));

  const selectActiveCity = (city: City) => {
    setActiveCity(city);
    setLocation('');
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!cities?.length) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev < cities.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0) {
          selectActiveCity(cities[activeIndex]);
        }
        break;
      case 'Escape':
        setCities(undefined);
        setActiveIndex(-1);
        break;
    }
  };

  useEffect(() => {
    const getCities = async () => {
      try {
        const res = await searchCityLocation(location);
        setCities(res);
        setActiveIndex(-1);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setError(errorMessage);
      }
    };

    if (location.length > 0) {
      getCities();
    } else {
      setCities(undefined);
    }
  }, [location, setError]);

  return (
    <section
      id="search-bar-section"
      className="md:px-3 mt-10 flex justify-center gap-3"
      aria-label="City search"
    >
      <div className="w-full relative">
        <Subtitle text="Search for any city in the world and click on it" />

        <div
          role="combobox"
          aria-expanded={!!cities}
          aria-haspopup="listbox"
          aria-controls="city-list"
        >
          <input
            className="w-full p-2 md:p-3 text-xl rounded md:rounded-lg text-black"
            type="text"
            placeholder="Enter location"
            onChange={(e) => processLocationChange(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Search for a city"
            aria-autocomplete="list"
            aria-controls="city-list"
            aria-activedescendant={activeIndex >= 0 ? `city-option-${activeIndex}` : undefined}
          />
        </div>
        <RadioButtons
          title="Select units of measurement:"
          options={[
            { label: 'Metric (ºC)', value: 'metric' },
            { label: 'Imperial (ºF)', value: 'imperial' },
            { label: 'Stardard (K)', value: 'standard' },
          ]}
          changeValue={(value) => setUnits(value as keyof Units)}
          defaultValue={units}
        />

        {cities?.length === 0 && (
          <p role="alert" data-testid="search-error-message" className="p-4 text-red-500">
            No results found for &quot; {location} &quot;
          </p>
        )}

        {cities && (
          <div
            id="city-list"
            role="listbox"
            className="absolute z-10 w-full max-h-96 overflow-y-auto bg-white md:rounded-lg shadow-md top-[105%] md:top-[150px] lg:top-[120px]"
            aria-label="Search results"
          >
            {cities.map((city, idx) => (
              <div
                role="option"
                id={`city-option-${idx}`}
                key={`${city.lat} - ${city.lon} - ${idx}`}
                className={clsx('cursor-pointer text-black hover:bg-gray-100 px-4 py-2', {
                  'bg-gray-100': activeIndex === idx,
                })}
                onClick={() => selectActiveCity(city)}
                aria-selected={activeIndex === idx}
                data-testid="search-city-option"
              >
                {city.name}, {city.state}, {city.country}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

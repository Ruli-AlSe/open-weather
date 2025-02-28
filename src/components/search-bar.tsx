'use client';

import clsx from 'clsx';

import { Units } from '@/lib/definitions/requests';
import { Subtitle } from './ui/subtitle';
import { RadioButtons } from './ui/radio-buttons';
import { useSearchBar } from '@/hooks';
import { useTranslations } from 'next-intl';

export const SearchBar = () => {
  const {
    location,
    cities,
    activeIndex,
    units,
    setUnits,
    selectActiveCity,
    handleKeyDown,
    processLocationChange,
  } = useSearchBar();
  const t = useTranslations('SearchBar');

  return (
    <section
      id="search-bar-section"
      className="md:px-3 mt-10 flex justify-center gap-3"
      aria-label="City search"
    >
      <div className="w-full relative">
        <Subtitle text={t('subtitle')} />

        <div
          role="combobox"
          aria-expanded={!!cities}
          aria-haspopup="listbox"
          aria-controls="city-list"
        >
          <input
            className={clsx(
              'w-full p-2 md:p-3 text-xl rounded md:rounded-lg text-black focus:outline-none focus:ring-2',
              {
                'focus:ring-blue-500': cities && cities.length > 0,
                'focus:ring-red-500': cities?.length === 0,
              }
            )}
            type="text"
            placeholder="Enter location"
            onChange={(e) => processLocationChange(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Search for a city"
            aria-autocomplete="list"
            aria-controls="city-list"
            aria-activedescendant={activeIndex >= 0 ? `city-option-${activeIndex}` : undefined}
          />
          {cities?.length === 0 && (
            <p role="alert" data-testid="search-error-message" className="p-4 text-red-500">
              No results found for &quot; {location} &quot;
            </p>
          )}
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

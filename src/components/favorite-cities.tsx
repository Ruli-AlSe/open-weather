'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

import { City } from '@/lib/definitions/requests';
import { useCityStore } from '@/stores/use-city-store';
import { Subtitle } from './ui/subtitle';
import { Button } from './ui/button';
import { handleKeyPress, removeActiveCityFromLocalStorage } from '@/lib/utils';

export const FavoriteCities = () => {
  const { favCities, addFavCities, removeFavCity, setActiveCity } = useCityStore((state) => state);
  const t = useTranslations('FavoriteCities');
  const removeCity = (lat: number, lon: number) => {
    removeActiveCityFromLocalStorage(lat, lon);

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
    <section className="px-5" aria-label={t('subtitle')} role="region">
      <Subtitle text={t('subtitle')} />

      <div
        id="favorite-cities"
        className="px-1 grid grid-cols-1 gap-4 text-white max-h-60 md:max-h-[26rem] overflow-y-scroll"
        role="list"
        aria-label={t('subtitle')}
      >
        {!favCities.length && <p role="alert">{t('emptyList')}</p>}
        {favCities.map(({ lat, lon, name, country, state }, idx) => {
          return (
            <div
              key={`${lat} - ${lon} - ${idx}`}
              data-testid="favorite-city"
              className="flex flex-col justify-between bg-gradient-to-r from-blue-500 to-blue-400 hover:to-blue-600 rounded-lg shadow-md p-4 rise-up-component"
              role="listitem"
              tabIndex={0}
              aria-label={`${name}, ${state}, ${country}`}
            >
              <div
                className="mb-5 hover:cursor-pointer hover:underline"
                onClick={() => setActiveCity({ lat, lon, name, country, state })}
                role="button"
                onKeyDown={(event) =>
                  handleKeyPress(event, () => setActiveCity({ lat, lon, name, country, state }))
                }
                tabIndex={0}
                aria-label={t('aria.displayInfoFor', {
                  city: name,
                  state,
                  country,
                })}
              >
                <h3 className="text-xl font-bold">{name}</h3>
                <p className="text-gray-200">{`${state}, ${country}`}</p>
              </div>

              <Button
                text={t('buttonRemove')}
                buttonType="button"
                action={() => removeCity(lat, lon)}
                extraClasses="w-fit bg-red-500 duration-300 hover:bg-red-700 text-sm rounded-lg font-bold"
                testId={`remove-fav-city-${name}-${state}-${country}`}
                aria-label={t('aria.removeFavoriteCity', { city: name, state, country })}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};

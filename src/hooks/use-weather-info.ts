import { useEffect, useState } from 'react';

import { useCityStore, useErrorStore } from '@/stores';
import { saveActiveCityToLocalStorage } from '@/lib/utils';
import { Climate } from '@/lib/definitions/requests';
import { getCurrentClimate } from '@/actions';

export const useWeatherInfo = () => {
  const { activeCity, favCities, units, addFavCities } = useCityStore((state) => state);
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
        const res = await getCurrentClimate(lat, lon, units);
        setClimate(res);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setError(errorMessage);
      }
    };

    getClimate();
  }, [activeCity, units, setError]);

  return {
    climate,
    favCities,
    activeCity,
    units,
    // functions
    addCityToFav,
  };
};

import { useEffect, useState } from 'react';

import { City } from '@/lib/definitions/requests';
import { useCityStore, useErrorStore } from '@/stores';
import { debounce } from '@/lib/utils';
import { searchCityLocation } from '@/actions';

export const useSearchBar = () => {
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

  return {
    location,
    cities,
    activeIndex,
    units,
    setUnits,
    handleKeyDown,
    processLocationChange,
    selectActiveCity,
  };
};

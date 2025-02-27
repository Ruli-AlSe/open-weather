import { useEffect, useState } from 'react';

import { useCityStore, useErrorStore } from '@/stores';
import { TempForecast } from '@/lib/definitions/requests';
import { getDailyTempForecast, getHourlyForecast } from '@/actions';

export const useTempForecast = () => {
  const { activeCity, units } = useCityStore((state) => state);
  const [hourlyForecast, setHourlyForecast] = useState<TempForecast[]>([]);
  const [dailyForecast, setDailyForecast] = useState<TempForecast[]>([]);
  const setError = useErrorStore((state) => state.setError);

  useEffect(() => {
    const getClimate = async () => {
      if (!activeCity) {
        return;
      }

      const { lat, lon } = activeCity;
      try {
        const [hourlyRes, dailyRes] = await Promise.all([
          getHourlyForecast(lat, lon, units),
          getDailyTempForecast(lat, lon, units),
        ]);

        setHourlyForecast(hourlyRes);
        setDailyForecast(dailyRes);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setError(errorMessage);
      }
    };

    getClimate();
  }, [activeCity, units, setError]);

  return {
    hourlyForecast,
    dailyForecast,
    activeCity,
    units,
  };
};

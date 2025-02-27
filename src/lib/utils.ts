import { City, Forecast, TempForecast, Units } from './definitions/requests';

export const debounce = (callback: (value: string) => void, timeout = 400) => {
  let timer: NodeJS.Timeout;
  return (value: string) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      callback(value);
    }, timeout);
  };
};

export const convert3hrForecastToHourlyForecast = (forecast: Forecast[]) => {
  const result: TempForecast[] = [];

  for (let i = 0; i < forecast.length; i++) {
    const currentElem = forecast[i];
    const currentDate = new Date(currentElem.dt_txt + 'z');
    const currentTemp = currentElem.main.temp;

    result.push({
      temp: currentTemp,
      dt_txt: convertUTCToLocal(currentElem.dt_txt),
    });

    if (i < forecast.length - 1) {
      const nextElem = forecast[i + 1];
      const nextDate = new Date(nextElem.dt_txt + 'z');
      const hoursBetweenData = (nextDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60);
      const tempDiff = nextElem.main.temp - currentTemp;
      const hourTempDiff = tempDiff / hoursBetweenData;

      for (let h = 1; h < hoursBetweenData; h++) {
        const newDate = new Date(currentDate);
        newDate.setHours(currentDate.getHours() + h);

        const nuevaTemp = currentTemp + hourTempDiff * h;

        result.push({
          temp: Number(nuevaTemp.toFixed(2)),
          dt_txt: convertUTCToLocal(newDate.toISOString()),
        });
      }
    }
  }

  return result;
};

export const convertUTCToLocal = (date: string) => {
  const localDate = date.includes('Z') ? new Date(date) : new Date(date + 'z');
  return `${localDate.toDateString()}-${localDate.toLocaleTimeString()}`;
};

export const apiDateFormat = (date: Date) => {
  const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
  const year = utcDate.getFullYear();
  const month = (utcDate.getMonth() + 1).toString().padStart(2, '0');
  const day = utcDate.getDate().toString().padStart(2, '0');
  const hour = utcDate.getHours().toString().padStart(2, '0');

  return `${year}-${month}-${day} ${hour}:00:00`;
};

export const convertToDailyTempForecast = (forecast: Forecast[]) => {
  const result: TempForecast[] = [];

  let tempMaxAcc: number[] = [];
  let tempMinAcc: number[] = [];
  for (let i = 0; i < forecast.length; i++) {
    const currentElem = forecast[i];
    const currentDate = currentElem.dt_txt;
    tempMaxAcc.push(currentElem.main.temp_max);
    tempMinAcc.push(currentElem.main.temp_min);

    if (!forecast[i + 1] || currentDate.split(' ')[0] !== forecast[i + 1].dt_txt.split(' ')[0]) {
      const formattedDate = new Date(currentDate.split(' ')[0]).toDateString();
      result.push({
        temp_max: Math.max(...tempMaxAcc),
        temp_min: Math.min(...tempMinAcc),
        dt_txt: formattedDate,
      });
      tempMaxAcc = [];
      tempMinAcc = [];
    }
  }

  return result;
};

export const isRushHour = (timeStr: string) => {
  const [time] = timeStr.split(' ');
  const [hours] = time.split(':');
  const hour = parseInt(hours);

  return hour >= 6 && hour <= 8;
};

export const isDayHour = (timeStr: string) => {
  const [time, period] = timeStr.split(' ');
  const [hours] = time.split(':');
  const hour = parseInt(hours);

  return (
    (hour > 8 && hour < 12 && period === 'AM') ||
    (hour === 12 && period === 'PM') ||
    (hour >= 1 && hour < 6 && period === 'PM')
  );
};

export const saveActiveCityToLocalStorage = (activeCity: City) => {
  const localStorageCities = localStorage.getItem('fav-cities');
  if (!localStorageCities) {
    localStorage.setItem('fav-cities', JSON.stringify([activeCity]));
  } else {
    const favCities = JSON.parse(localStorageCities);
    favCities.push(activeCity);
    localStorage.setItem('fav-cities', JSON.stringify(favCities));
  }
};

export const removeActiveCityFromLocalStorage = (lat: number, lon: number) => {
  const localStorageCities = localStorage.getItem('fav-cities');
  if (localStorageCities) {
    const parsedFavCities = JSON.parse(localStorageCities) as City[];
    const newFavCities = parsedFavCities.filter((city) => city.lat !== lat && city.lon !== lon);
    localStorage.setItem('fav-cities', JSON.stringify(newFavCities));
  }
};

export const formatTemperature = (temp: number, units: keyof Units) => {
  switch (units) {
    case 'imperial':
      return `${Math.round(temp)} °F`;
    case 'standard':
      return `${Math.round(temp)} K`;
    default:
      return `${Math.round(temp)} °C`;
  }
};

export const handleKeyPress = <T extends HTMLElement>(
  event: React.KeyboardEvent<T>,
  callback: () => void
) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    callback();
  }
};

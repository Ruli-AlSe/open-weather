import { Forecast, TempForecast } from './definitions';

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

  let tempMaxAcc = 0;
  let tempMinAcc = 0;
  let counter = 0;
  for (let i = 0; i < forecast.length; i++) {
    const currentElem = forecast[i];
    const currentDate = currentElem.dt_txt;
    tempMaxAcc += currentElem.main.temp_max;
    tempMinAcc += currentElem.main.temp_min;

    if (forecast[i + 1] && currentDate.split(' ')[0] === forecast[i + 1].dt_txt.split(' ')[0]) {
      counter++;
    } else {
      const formattedDate = new Date(currentDate.split(' ')[0]).toDateString();
      result.push({
        temp_max: Number((tempMaxAcc / counter).toFixed(2)),
        temp_min: Number((tempMinAcc / counter).toFixed(2)),
        dt_txt: formattedDate,
      });
      tempMaxAcc = 0;
      tempMinAcc = 0;
      counter = 0;
    }
  }

  return result;
};

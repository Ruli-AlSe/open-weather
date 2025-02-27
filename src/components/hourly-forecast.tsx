'use client';

import { Subtitle } from './ui/subtitle';
import { Card } from './ui/card';
import { formatTemperature } from '@/lib/utils';
import { useTempForecast } from '@/hooks';

export const HourlyForecast = () => {
  const { hourlyForecast, activeCity, units } = useTempForecast();

  if (!hourlyForecast.length) {
    return null;
  }

  return (
    <section
      className="flex flex-col gap-5 fade-in-component"
      aria-label={`Hourly weather forecast for ${activeCity?.name}, ${activeCity?.country}`}
    >
      <Subtitle text="Forecast for next 24 hrs" />

      <div
        id="hourly-forecast-wrapper"
        className="w-full flex gap-5 overflow-x-scroll py-5"
        role="region"
        aria-label="Hourly temperature forecast scrollable content"
        tabIndex={0}
      >
        {hourlyForecast.map(({ dt_txt, temp }) => {
          const [date, time] = dt_txt.split('-');
          return (
            <Card
              key={dt_txt}
              title={date}
              timeStr={time}
              aria-label={`Weather forecast for ${date} at ${time}`}
            >
              <p
                className="text-3xl my-7 font-extrabold"
                aria-label={`Temperature: ${formatTemperature(temp!, units)} ${units} degrees`}
              >
                {formatTemperature(temp!, units)}
              </p>
              <p aria-label={`Time: ${time}`}>{time}</p>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

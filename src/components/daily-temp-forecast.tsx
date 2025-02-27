'use client';

import { Subtitle } from './ui/subtitle';
import { Card } from './ui/card';
import { formatTemperature } from '@/lib/utils';
import { useTempForecast } from '@/hooks';

export const DailyTempForecast = () => {
  const { dailyForecast, activeCity, units } = useTempForecast();

  if (!dailyForecast.length) {
    return null;
  }

  return (
    <section
      className="flex flex-col gap-5 fade-in-component"
      aria-label={`Daily temperature forecast for ${activeCity?.name}, ${activeCity?.country}`}
    >
      <Subtitle text="Forecast max/min temp for the rest of the week" />

      <div
        id="daily-temp-forecast-wrapper"
        className="w-full flex gap-5 overflow-x-scroll py-5"
        role="region"
        aria-label="Daily temperature forecast scrollable content"
        tabIndex={0}
      >
        {dailyForecast.map(({ dt_txt, temp_max, temp_min }) => (
          <Card key={dt_txt} title={dt_txt} aria-label={`Weather forecast for ${dt_txt}`}>
            <p
              className="text-3xl my-4 font-extrabold flex flex-col items-center"
              aria-label={`Maximum temperature: ${formatTemperature(
                temp_max!,
                units
              )} ${units} degrees`}
            >
              <span className="text-sm">Max temp.</span>
              <span>{formatTemperature(temp_max!, units)}</span>
            </p>
            <p
              className="text-3xl my-4 font-extrabold flex flex-col items-center"
              aria-label={`Minimum temperature: ${formatTemperature(
                temp_min!,
                units
              )} ${units} degrees`}
            >
              <span className="text-sm">Min temp.</span>
              <span>{formatTemperature(temp_min!, units)}</span>
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
};

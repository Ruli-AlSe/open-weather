'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { Subtitle } from './ui/subtitle';
import { Card } from './ui/card';
import { formatTemperature } from '@/lib/utils';
import { useTempForecast } from '@/hooks';

export const DailyTempForecast = () => {
  const { dailyForecast, activeCity, units } = useTempForecast();
  const t = useTranslations('DailyTempForecast');
  const format = useFormatter();

  if (!dailyForecast.length) {
    return null;
  }

  return (
    <section
      className="flex flex-col gap-5 fade-in-component"
      aria-label={t('aria.sectionTitle', { city: activeCity?.name, country: activeCity?.country })}
    >
      <Subtitle text={t('subtitle')} />

      <div
        id="daily-temp-forecast-wrapper"
        className="w-full flex gap-5 overflow-x-scroll py-5"
        role="region"
        aria-label={t('aria.sectionScrollTitle')}
        tabIndex={0}
      >
        {dailyForecast.map(({ dt_txt, temp_max, temp_min }) => {
          const date = new Date(dt_txt);
          const formattedDate = format.dateTime(date, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });
          return (
            <Card
              key={dt_txt}
              title={formattedDate}
              aria-label={t('aria.forecastCardTitle', {
                date: formattedDate,
              })}
            >
              <p
                className="text-3xl my-4 font-extrabold flex flex-col items-center"
                aria-label={t('aria.forecastCardMaxTemp', {
                  temp: formatTemperature(temp_max!, units),
                  units,
                })}
              >
                <span className="text-sm">{t('maxTemp')}</span>
                <span>{formatTemperature(temp_max!, units)}</span>
              </p>
              <p
                className="text-3xl my-4 font-extrabold flex flex-col items-center"
                aria-label={t('aria.forecastCardMinTemp', {
                  temp: formatTemperature(temp_min!, units),
                  units,
                })}
              >
                <span className="text-sm">{t('minTemp')}</span>
                <span>{formatTemperature(temp_min!, units)}</span>
              </p>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

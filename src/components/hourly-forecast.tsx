'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { Subtitle } from './ui/subtitle';
import { Card } from './ui/card';
import { formatTemperature } from '@/lib/utils';
import { useTempForecast } from '@/hooks';

export const HourlyForecast = () => {
  const { hourlyForecast, activeCity, units } = useTempForecast();
  const t = useTranslations('HourlyTempForecast');
  const format = useFormatter();

  if (!hourlyForecast.length) {
    return null;
  }

  return (
    <section
      className="flex flex-col gap-5 fade-in-component"
      aria-label={t('aria.sectionTitle', {
        city: activeCity?.name,
        country: activeCity?.country,
      })}
    >
      <Subtitle text={t('subtitle')} />

      <div
        id="hourly-forecast-wrapper"
        className="w-full flex gap-5 overflow-x-scroll py-5"
        role="region"
        aria-label={t('aria.sectionScrollTitle')}
        tabIndex={0}
      >
        {hourlyForecast.map(({ dt_txt, temp }) => {
          const [date, time] = dt_txt.split('-');
          const currentDate = new Date(date);
          const formattedDate = format.dateTime(currentDate, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });
          return (
            <Card
              key={dt_txt}
              title={formattedDate}
              timeStr={time}
              aria-label={t('aria.forecastCardTitle', { date, hour: time })}
            >
              <p
                className="text-3xl my-7 font-extrabold"
                aria-label={t('aria.forecastCardTemp', { temp: temp, units })}
              >
                {formatTemperature(temp!, units)}
              </p>
              <p aria-label={t('aria.forecastTime', { hour: time })}>{time}</p>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

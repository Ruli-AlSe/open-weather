import clsx from 'clsx';
import { ReactNode } from 'react';

export const Card = ({
  title,
  timeStr,
  children,
}: {
  title: string;
  timeStr?: string;
  children: ReactNode;
}) => {
  const isRushHour = (timeStr: string) => {
    const [time] = timeStr.split(' ');
    const [hours] = time.split(':');
    const hour = parseInt(hours);

    return hour >= 6 && hour <= 8;
  };

  const isDayHour = (timeStr: string) => {
    const [time, period] = timeStr.split(' ');
    const [hours] = time.split(':');
    const hour = parseInt(hours);

    return (
      (hour > 8 && hour < 12 && period === 'AM') ||
      (hour === 12 && period === 'PM') ||
      (hour >= 1 && hour < 6 && period === 'PM')
    );
  };

  return (
    <div
      className={clsx('flex flex-col items-center p-3 rounded text-white', {
        'bg-gradient-to-b from-blue-600 to-blue-800': timeStr && isRushHour(timeStr),
        'bg-gradient-to-b from-blue-400 to-blue-600': timeStr && isDayHour(timeStr),
        'bg-gradient-to-b from-blue-800 to-blue-950':
          timeStr && !isRushHour(timeStr) && !isDayHour(timeStr),
        'bg-orange-500': !timeStr,
      })}
    >
      <p className="w-40">{title}</p>
      {children}
    </div>
  );
};

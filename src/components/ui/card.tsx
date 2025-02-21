import clsx from 'clsx';

import { CardProps } from '@/lib/definitions/ui';
import { isDayHour, isRushHour } from '@/lib/utils';

export const Card = ({ title, timeStr, children }: CardProps) => {
  return (
    <div
      className={clsx('flex flex-col items-center p-3 rounded text-white', {
        'bg-gradient-to-l from-blue-600 to-blue-800': timeStr && isRushHour(timeStr),
        'bg-gradient-to-l from-blue-400 to-blue-600': timeStr && isDayHour(timeStr),
        'bg-gradient-to-l from-blue-800 to-blue-950':
          timeStr && !isRushHour(timeStr) && !isDayHour(timeStr),
        'bg-orange-500': !timeStr,
      })}
    >
      <p className="w-40">{title}</p>
      {children}
    </div>
  );
};

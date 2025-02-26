'use client';

import { useErrorStore } from '@/stores/use-error-store';
import { useEffect } from 'react';

export const ErrorBlock = () => {
  const errors = useErrorStore((state) => state.errors);
  const removeErrors = useErrorStore((state) => state.removeErrors);

  useEffect(() => {
    const timer = setTimeout(() => {
      removeErrors();
    }, 4000);

    return () => clearTimeout(timer);
  }, [errors]);

  if (errors.length === 0) {
    return null;
  }

  return (
    <div className="absolute right-5 top-10 w-[500px] flex flex-col items-center justify-center">
      {errors.map((error, index) => (
        <p
          id="error-alert"
          data-testid="error-alert"
          key={index}
          className="w-full p-5 text-center bg-red-800 text-white text-xl mb-3 rounded-2xl rise-up-component"
        >
          {error}
        </p>
      ))}
    </div>
  );
};

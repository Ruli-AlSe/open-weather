import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';

import { ButtonProps } from '@/lib/definitions/ui';

export const Button = ({
  text,
  iconUrl,
  action,
  buttonType = 'button',
  extraClasses,
  href,
  disabled = false,
}: ButtonProps) => {
  if (buttonType === 'button') {
    return (
      <button
        type={buttonType}
        className={clsx('flex justify-center px-3 py-2 rounded-lg font-bold', extraClasses, {
          'bg-gradient-to-r from-gray-500 to-gray-400 hover:to-gray-400': disabled,
        })}
        disabled={disabled}
        onClick={action}
      >
        {text}
        {iconUrl && <Image src={iconUrl} alt={text} width={25} height={25} className="ml-4" />}
      </button>
    );
  }

  if (buttonType === 'external-link') {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={clsx('flex justify-center px-3 py-2 rounded-lg font-bold', extraClasses)}
      >
        {text}
        {iconUrl && <Image src={iconUrl} alt={text} width={25} height={25} className="ml-4" />}
      </a>
    );
  }

  return (
    <Link
      href={href!}
      className={clsx('flex justify-center px-3 py-2 rounded-lg font-bold', extraClasses)}
    >
      {text}
      {iconUrl && <Image src={iconUrl} alt={text} width={25} height={25} className="ml-4" />}
    </Link>
  );
};

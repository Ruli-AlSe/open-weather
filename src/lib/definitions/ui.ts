type BaseButtonProps = {
  text: string;
  disabled?: boolean;
  extraClasses?: string;
  iconUrl?: string;
};

type ActionButtonProps = BaseButtonProps & {
  buttonType: 'button';
  action: () => void;
  href?: never;
};

type LinkButtonProps = BaseButtonProps & {
  buttonType: 'link' | 'external-link';
  href: string;
  action?: never;
};

export type ButtonProps = ActionButtonProps | LinkButtonProps;

import type { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

export default function Button({
  variant = 'primary',
  type = 'button',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`button button--${variant} ${className}`.trim()}
      type={type}
      {...props}
    />
  );
}

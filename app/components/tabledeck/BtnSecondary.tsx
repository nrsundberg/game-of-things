import type { ButtonHTMLAttributes, ReactNode } from "react";

interface BtnSecondaryProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

/**
 * BtnSecondary — bone ivory button with pressed / hover states.
 */
export default function BtnSecondary({
  children,
  className = "",
  ...rest
}: BtnSecondaryProps) {
  return (
    <button className={`td-btn-secondary ${className}`} {...rest}>
      {children}
    </button>
  );
}

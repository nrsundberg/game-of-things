import type { CSSProperties, ReactNode } from "react";

interface PlaqueProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * Plaque — raised kraft plaque for the game masthead.
 * Sits on the kraft cardstock surface.
 */
export default function Plaque({ children, className = "", style }: PlaqueProps) {
  return (
    <div className={`td-plaque ${className}`} style={style}>
      {children}
    </div>
  );
}

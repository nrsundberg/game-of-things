import type { ReactNode } from "react";

interface TicketProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  /** Use bone variant (ivory/bone chip for action buttons) */
  bone?: boolean;
}

/**
 * Ticket — raffle-ticket chip with chamfered clip-path.
 * Default is the mustard td-ticket variant.
 * Pass bone=true for the bone/ivory variant used for host action chips.
 */
export default function Ticket({
  children,
  onClick,
  className = "",
  bone = false,
}: TicketProps) {
  const baseClass = bone ? "td-ticket-bone" : "td-ticket";
  if (onClick) {
    return (
      <button
        className={`${baseClass} ${className}`}
        onClick={onClick}
        type="button"
      >
        {children}
      </button>
    );
  }
  return (
    <div className={`${baseClass} ${className}`}>
      {children}
    </div>
  );
}

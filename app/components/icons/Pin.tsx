interface PinProps {
  size?: number;
  color?: string;
  className?: string;
}

export default function Pin({ size = 20, color = "#c8372a", className = "" }: PinProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Pin head */}
      <circle cx="10" cy="8" r="7" fill={color} />
      <circle cx="8" cy="6" r="2" fill="rgba(255,255,255,0.35)" />
      {/* Pin body/needle */}
      <line x1="10" y1="15" x2="10" y2="24" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* Inner highlight on head */}
      <circle cx="10" cy="8" r="7" stroke="rgba(0,0,0,0.2)" strokeWidth="1" fill="none" />
    </svg>
  );
}

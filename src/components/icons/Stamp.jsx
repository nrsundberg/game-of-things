export default function Stamp({ size = 24, color = "currentColor", ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Rubber stamp head */}
      <rect x="4" y="3" width="16" height="10" rx="2" fill={color} opacity="0.9" />
      {/* Stamp handle */}
      <rect x="9" y="13" width="6" height="5" rx="1" fill={color} opacity="0.7" />
      <rect x="7" y="17" width="10" height="3" rx="1" fill={color} opacity="0.5" />
      {/* Ink marks on face */}
      <line x1="7" y1="7" x2="17" y2="7" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      <line x1="7" y1="10" x2="14" y2="10" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

export default function Crown({ size = 24, color = "currentColor", ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M2 14l2-10 5 6 3-8 3 8 5-6 2 10H2z"
        fill={color}
        stroke={color}
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

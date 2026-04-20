export default function Strike({ width = 80, height = 4, color = "rgba(200,55,42,0.7)", ...props }) {
  return (
    <svg
      width={width}
      height={height + 4}
      viewBox={`0 0 ${width} ${height + 4}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Hand-drawn strike-through line */}
      <path
        d={`M2 ${(height + 4) / 2 + 1} Q${width * 0.25} ${(height + 4) / 2 - 2} ${width * 0.5} ${(height + 4) / 2 + 1} Q${width * 0.75} ${(height + 4) / 2 + 3} ${width - 2} ${(height + 4) / 2}`}
        stroke={color}
        strokeWidth={height}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

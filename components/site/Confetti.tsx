import type { CSSProperties } from "react";

const COLORS = [
  "#34d399",
  "#60a5fa",
  "#c084fc",
  "#fbbf24",
  "#fb7185",
  "#22d3ee",
];

export function Confetti({ burst }: { burst: number }) {
  return (
    <span
      key={burst}
      data-confetti
      data-burst={burst}
      aria-hidden="true"
      className="confetti-layer"
    >
      {Array.from({ length: 14 }, (_, index) => {
        const angle = (index / 14) * Math.PI * 2;
        const distance = 26 + (index % 5) * 8;

        return (
          <span
            key={index}
            className="confetti-piece"
            style={
              {
                "--confetti-x": `${Math.cos(angle) * distance}px`,
                "--confetti-y": `${Math.sin(angle) * distance - 10}px`,
                "--confetti-r": `${(index % 2 ? 1 : -1) * (90 + index * 23)}deg`,
                "--confetti-c": COLORS[index % COLORS.length],
                animationDelay: `${(index % 3) * 20}ms`,
              } as CSSProperties
            }
          />
        );
      })}
    </span>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EnclavePuzzle } from "./EnclavePuzzle";

/**
 * Isometric, line-drawn exploded view of a phone — each layer maps to a part
 * of how Ramzy builds. Hover to take it apart, double-click (or the button)
 * to lock it open, drag to rotate. Pure CSS 3D + SVG, no WebGL.
 */

type Layer = {
  id: string;
  name: string;
  detail: string;
  side: "left" | "right";
  labelY: number;
  leader: number;
  art: React.ReactNode;
};

const W = 200;
const H = 380;
const DEFAULT_RX = 58;
const DEFAULT_RZ = -38;

const Chassis = (
  <>
    <rect x="1" y="1" width={W - 2} height={H - 2} rx="26" />
    <rect x="9" y="9" width={W - 18} height={H - 18} rx="20" strokeDasharray="3 4" opacity="0.6" />
    <rect x="-3" y="92" width="3" height="34" rx="1.5" />
    <rect x="-3" y="140" width="3" height="54" rx="1.5" />
    <rect x={W} y="120" width="3" height="60" rx="1.5" />
    <circle cx="42" cy="44" r="16" />
    <circle cx="42" cy="44" r="9" />
    <circle cx="42" cy="82" r="11" />
    <circle cx="42" cy="82" r="5" />
    {[
      [20, 20],
      [W - 20, 20],
      [20, H - 20],
      [W - 20, H - 20],
    ].map(([cx, cy]) => (
      <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3" />
    ))}
    <path d={`M14 ${H + 14} H${W - 14}`} opacity="0.6" />
    <path d={`M14 ${H + 9} V${H + 19} M${W - 14} ${H + 9} V${H + 19}`} opacity="0.6" />
  </>
);

const Enclave = (
  <>
    <rect x="16" y="16" width={W - 32} height={H - 32} rx="18" strokeDasharray="5 5" />
    <path d="M100 116 L142 133 V176 C142 205 123 224 100 235 C77 224 58 205 58 176 V133 Z" />
    <path d="M100 128 L131 141 V176 C131 198 117 213 100 222 C83 213 69 198 69 176 V141 Z" opacity="0.5" />
    <rect x="87" y="170" width="26" height="21" rx="3" />
    <path d="M92 170 V162 a8 8 0 0 1 16 0 V170" />
    <circle cx="100" cy="179" r="2.4" />
    <path d="M100 181 V186" />
    {Array.from({ length: 6 }, (_, row) =>
      Array.from({ length: 11 }, (_, col) => (
        <circle
          key={`${row}-${col}`}
          cx={40 + col * 12}
          cy={268 + row * 12}
          r="1.3"
          opacity={0.35 + ((row + col) % 3) * 0.2}
        />
      ))
    )}
  </>
);

const LogicBoard = (
  <>
    <rect x="12" y="12" width={W - 24} height={H - 24} rx="16" />
    <rect x="68" y="140" width="64" height="64" rx="5" />
    <rect x="78" y="150" width="44" height="44" rx="2" opacity="0.6" />
    {Array.from({ length: 6 }, (_, i) => {
      const o = 146 + i * 10;
      return (
        <g key={i} opacity="0.75">
          <path d={`M${o - 6} 140 V133`} />
          <path d={`M${o - 6} 204 V211`} />
          <path d={`M68 ${o} H61`} />
          <path d={`M132 ${o} H139`} />
        </g>
      );
    })}
    <g opacity="0.7">
      <path d="M139 156 H162 V86 H176" />
      <path d="M139 186 H168 V300" />
      <path d="M61 166 H40 V62" />
      <path d="M61 186 H48 V318" />
      <path d="M110 211 V262 H146 V334" />
      <path d="M88 211 V280 H60" />
      <path d="M96 133 V96 H128 V52" />
    </g>
    <rect x="150" y="40" width="22" height="36" rx="2" />
    <rect x="28" y="300" width="28" height="18" rx="2" />
    <rect x="150" y="306" width="24" height="24" rx="2" />
    <rect x="118" y="36" width="20" height="14" rx="2" />
    {[60, 76, 92].map((y) => (
      <rect key={y} x="30" y={y + 140} width="10" height="6" rx="1" opacity="0.7" />
    ))}
    <text x="100" y="176" textAnchor="middle" className="xs-svg-text">
      KRG-X1
    </text>
  </>
);

const Interface = (
  <>
    <rect x="8" y="8" width={W - 16} height={H - 16} rx="20" />
    <path d="M24 30 H54 M150 30 H176" opacity="0.6" />
    <rect x="22" y="42" width="156" height="28" rx="7" />
    <path d="M34 56 H96" />
    <circle cx="162" cy="56" r="6" opacity="0.7" />
    <rect x="22" y="82" width="156" height="72" rx="10" />
    <path d="M34 98 H120 M34 110 H150 M34 122 H104" opacity="0.6" />
    <rect x="34" y="132" width="44" height="12" rx="6" opacity="0.8" />
    <rect x="22" y="164" width="74" height="74" rx="10" />
    <rect x="104" y="164" width="74" height="74" rx="10" />
    <circle cx="59" cy="194" r="12" opacity="0.6" />
    <path d="M118 184 H164 M118 196 H150" opacity="0.6" />
    <path d="M36 222 H82 M118 222 H160" opacity="0.6" />
    {[254, 278, 302].map((y) => (
      <g key={y} opacity="0.7">
        <circle cx="32" cy={y} r="5" />
        <path d={`M44 ${y - 3} H120 M44 ${y + 4} H96`} />
      </g>
    ))}
    <circle cx="156" cy="330" r="14" />
    <path d="M156 323 V337 M149 330 H163" />
    <path d={`M8 ${H - 34} H${W - 8}`} opacity="0.5" />
    <path d="M44 362 h12 M94 362 h12 M144 362 h12" opacity="0.7" />
  </>
);

const Glass = (
  <>
    <rect x="1" y="1" width={W - 2} height={H - 2} rx="26" />
    <rect x="78" y="14" width="44" height="12" rx="6" />
    <circle cx="112" cy="20" r="2.5" />
    <path d="M24 136 L136 24" opacity="0.35" />
    <path d="M24 170 L158 36" opacity="0.25" />
    <path d="M60 356 L176 240" opacity="0.2" />
    <path d={`M84 ${H - 10} H116`} />
  </>
);

const LAYERS: Layer[] = [
  {
    id: "chassis",
    name: "Chassis",
    detail: "STEM education · robotics coaching",
    side: "right",
    labelY: 300,
    leader: 90,
    art: Chassis,
  },
  {
    id: "enclave",
    name: "Secure enclave",
    detail: "Kali Linux · DVWA · ethical hacking",
    side: "left",
    labelY: 180,
    leader: 120,
    art: Enclave,
  },
  {
    id: "logic",
    name: "Logic board",
    detail: "Python · SQL · AI backends",
    side: "right",
    labelY: 170,
    leader: 150,
    art: LogicBoard,
  },
  {
    id: "interface",
    name: "Interface",
    detail: "Flutter · Dart · mobile apps",
    side: "left",
    labelY: 90,
    leader: 110,
    art: Interface,
  },
  {
    id: "glass",
    name: "Cover glass",
    detail: "Product design · UI/UX",
    side: "right",
    labelY: 60,
    leader: 80,
    art: Glass,
  },
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function ExplodedStack() {
  const stageRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const angles = useRef({ rx: DEFAULT_RX, rz: DEFAULT_RZ });
  const [hovering, setHovering] = useState(false);
  const [locked, setLocked] = useState(false);
  const [puzzle, setPuzzle] = useState(false);
  const draggedRef = useRef(false);
  const open = locked || hovering;

  const applyAngles = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const { rx, rz } = angles.current;
    stage.style.setProperty("--rx", `${rx}deg`);
    stage.style.setProperty("--rz", `${rz}deg`);
    if (readoutRef.current) {
      const az = ((Math.round(-rz) % 360) + 360) % 360;
      readoutRef.current.textContent = `VIEW AZ ${az}° / EL ${Math.round(90 - rx)}°`;
    }
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    applyAngles();

    let dragging = false;
    let moved = false;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastY = 0;
    let frame = 0;

    const onDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      dragging = true;
      moved = false;
      draggedRef.current = false;
      startX = lastX = event.clientX;
      startY = lastY = event.clientY;
    };

    const onMove = (event: PointerEvent) => {
      if (!dragging) return;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;
      if (!moved && Math.hypot(event.clientX - startX, event.clientY - startY) > 4) {
        moved = true;
        draggedRef.current = true;
        stage.dataset.dragging = "true";
        stage.setPointerCapture?.(event.pointerId);
      }
      if (!moved) return;
      angles.current.rz += dx * 0.35;
      angles.current.rx = clamp(angles.current.rx - dy * 0.25, 18, 82);
      if (!frame) {
        frame = window.requestAnimationFrame(() => {
          frame = 0;
          applyAngles();
        });
      }
    };

    const onUp = (event: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      delete stage.dataset.dragging;
      if (stage.hasPointerCapture?.(event.pointerId)) {
        stage.releasePointerCapture(event.pointerId);
      }
      // A tap (no drag) on touch toggles the lock, since there is no hover.
      const onEnclave = (event.target as HTMLElement | null)?.closest(
        '[data-layer="enclave"]'
      );
      if (!moved && event.pointerType !== "mouse" && !(onEnclave && stage.dataset.open === "true")) {
        setLocked((value) => !value);
      }
    };

    stage.addEventListener("pointerdown", onDown);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerup", onUp);
    stage.addEventListener("pointercancel", onUp);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      stage.removeEventListener("pointerdown", onDown);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerup", onUp);
      stage.removeEventListener("pointercancel", onUp);
    };
  }, [applyAngles]);

  const resetView = () => {
    angles.current = { rx: DEFAULT_RX, rz: DEFAULT_RZ };
    applyAngles();
  };

  return (
    <section
      aria-labelledby="anatomy-heading"
      data-testid="exploded-stack"
      className="mx-auto mt-20 w-full max-w-[960px] px-4 md:px-6"
    >
      <div className="xs-panel">
        <div className="xs-panel__head">
          <div>
            <p className="xs-mono text-soft">FIG. 01 · EXPLODED VIEW</p>
            <h2 id="anatomy-heading" className="mt-1 text-lg font-semibold text-ink">
              Anatomy of how I build
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="xs-btn"
              aria-pressed={locked}
              onClick={() => setLocked((value) => !value)}
            >
              {locked ? "Put it back" : "Take it apart"}
            </button>
            <button type="button" className="xs-btn" onClick={resetView}>
              Reset view
            </button>
            <button
              type="button"
              className="xs-btn sr-only focus:not-sr-only"
              onClick={() => {
                setLocked(true);
                setPuzzle(true);
              }}
            >
              Crack the enclave
            </button>
          </div>
        </div>

        <div
          ref={stageRef}
          className="xs-stage"
          data-open={open ? "true" : "false"}
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse") setHovering(true);
          }}
          onPointerLeave={(event) => {
            if (event.pointerType === "mouse") setHovering(false);
          }}
          onDoubleClick={() => setLocked((value) => !value)}
        >
          <div className="xs-scene" style={{ width: W, height: H }}>
            {LAYERS.map((layer, index) => (
              <div
                key={layer.id}
                className="xs-layer"
                data-layer={layer.id}
                onClick={
                  layer.id === "enclave"
                    ? () => {
                        if (open && !draggedRef.current) setPuzzle(true);
                      }
                    : undefined
                }
                style={{ "--i": index } as React.CSSProperties}
              >
                <svg
                  viewBox={`-4 -4 ${W + 8} ${H + 28}`}
                  width={W + 8}
                  height={H + 28}
                  className="xs-art"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {layer.art}
                </svg>
                {index > 0
                  ? [
                      [16, 16],
                      [W - 16, 16],
                      [16, H - 16],
                      [W - 16, H - 16],
                    ].map(([x, y]) => (
                      <span
                        key={`${x}-${y}`}
                        aria-hidden="true"
                        className="xs-post"
                        style={{ left: x, top: y }}
                      />
                    ))
                  : null}
                <span
                  className="xs-label"
                  data-side={layer.side}
                  style={
                    {
                      top: layer.labelY,
                      "--leader": `${layer.leader}px`,
                    } as React.CSSProperties
                  }
                >
                  <span className="xs-label__line" aria-hidden="true" />
                  <span className="xs-label__body">
                    <span className="xs-label__name">{layer.name}</span>
                    <span className="xs-label__detail">{layer.detail}</span>
                    {layer.id === "enclave" ? (
                      <span className="xs-label__lock">[ locked · click to crack ]</span>
                    ) : null}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <ol className="xs-legend">
          {[...LAYERS].reverse().map((layer, index) => (
            <li key={layer.id}>
              <span className="xs-mono text-soft">0{index + 1}</span>
              <span className="font-medium text-ink">{layer.name}</span>
              <span className="text-body">
                {layer.detail}
                {layer.id === "enclave" ? (
                  <>
                    {" "}
                    <button
                      type="button"
                      className="font-mono text-xs text-ink underline underline-offset-4"
                      onClick={() => setPuzzle(true)}
                    >
                      [ crack it ]
                    </button>
                  </>
                ) : null}
              </span>
            </li>
          ))}
        </ol>

        <div className="xs-panel__foot">
          <p className="xs-mono">
            Hover to take it apart · double-click to lock · drag to rotate
          </p>
          <p className="xs-mono text-right">
            DWG KRG-001 · REV A
            <br />
            <span ref={readoutRef}>VIEW AZ 38° / EL 32°</span>
          </p>
        </div>
      </div>
      {puzzle ? <EnclavePuzzle onClose={() => setPuzzle(false)} /> : null}
    </section>
  );
}

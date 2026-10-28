import type { ArchiveKind, ProjectType } from "@/data";

const ARCHIVE_ART: Record<
  ArchiveKind,
  {
    from: string;
    to: string;
    ink: string;
    accent: string;
    stat: string;
    label: string;
    detail: string;
  }
> = {
  fll: {
    from: "#fde68a",
    to: "#fef3c7",
    ink: "#7c2d12",
    accent: "#b45309",
    stat: "3rd",
    label: "FLL Nationals",
    detail: "Best engineering design",
  },
  robofest: {
    from: "#ddd6fe",
    to: "#ede9fe",
    ink: "#4c1d95",
    accent: "#7c3aed",
    stat: "8th",
    label: "RoboFest",
    detail: "International placement",
  },
  wro: {
    from: "#bae6fd",
    to: "#e0f2fe",
    ink: "#075985",
    accent: "#0284c7",
    stat: "9th",
    label: "World Robot Olympiad",
    detail: "National team",
  },
  stem: {
    from: "#d9f99d",
    to: "#f7fee7",
    ink: "#3f6212",
    accent: "#65a30d",
    stat: "100+",
    label: "STEM education",
    detail: "Students mentored",
  },
  events: {
    from: "#fbcfe8",
    to: "#fdf2f8",
    ink: "#9d174d",
    accent: "#db2777",
    stat: "12+",
    label: "Robotics events",
    detail: "Coached, judged, facilitated",
  },
};

function Frame({
  color,
  children,
}: {
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ backgroundColor: color }}
    >
      {children}
    </div>
  );
}

function Wordmark({
  title,
  subtitle,
  ink,
  accent,
}: {
  title: string;
  subtitle: string;
  ink: string;
  accent: string;
}) {
  return (
    <div>
      <p
        className="text-[clamp(18px,4.8vw,24px)] font-semibold leading-[1.05] tracking-[-0.035em]"
        style={{ color: ink }}
      >
        {title}
      </p>
      <p
        className="mt-1 text-[clamp(9px,2.4vw,12px)] leading-tight"
        style={{ color: accent }}
      >
        {subtitle}
      </p>
    </div>
  );
}

function WindowShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full overflow-hidden rounded-xl border border-white/70 bg-white/85 shadow-[0_10px_30px_rgba(20,30,25,0.12)]">
      {children}
    </div>
  );
}

export function ProjectCover({ project }: { project: ProjectType }) {
  const { cover } = project;
  const palette = { ink: cover.ink, accent: cover.accent };

  return (
    <Frame color={cover.from}>
      {project.slug === "traderwise" && <TraderWise palette={palette} />}
      {project.slug === "notely" && <Notely palette={palette} />}
      {project.slug === "cyber-home-lab" && <HomeLab palette={palette} />}
      {project.slug === "makersplace-robotics" && <Makersplace palette={palette} />}
    </Frame>
  );
}

function TraderWise({ palette }: { palette: { ink: string; accent: string } }) {
  return (
    <>
      <div className="absolute left-[7%] top-[9%] w-[56%]">
        <Wordmark
          title="TraderWise"
          subtitle="Advice for market traders"
          ink={palette.ink}
          accent={palette.accent}
        />
      </div>

      <div className="absolute bottom-[9%] left-[7%] flex w-[34%] flex-col gap-[3%]">
        {["Today", "Margin", "Restock"].map((label) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-full bg-white/60 px-[8%] py-[4%]"
          >
            <span className="text-[clamp(7px,1.8vw,9px)]" style={{ color: palette.accent }}>
              {label}
            </span>
            <span
              className="h-[5px] w-[14%] rounded-full"
              style={{ backgroundColor: palette.accent, opacity: 0.35 }}
            />
          </div>
        ))}
      </div>

      <div className="absolute bottom-[8%] right-[7%] top-[34%] w-[46%]">
        <WindowShell>
          <div className="flex h-full flex-col gap-[4%] p-[6%]">
            <div className="flex items-center gap-[4%]">
              <span
                className="h-[clamp(10px,2.6vw,14px)] w-[clamp(10px,2.6vw,14px)] rounded-full"
                style={{ backgroundColor: palette.accent }}
              />
              <span className="h-[4px] w-[40%] rounded-full bg-[#cfe8c0]" />
            </div>
            <div className="grid grid-cols-3 gap-[4%]">
              {["Price", "Stock", "Ask"].map((label) => (
                <div key={label} className="rounded-md bg-[#eef8e6] px-[6%] py-[5%]">
                  <p className="text-[clamp(6px,1.6vw,8px)]" style={{ color: palette.accent }}>
                    {label}
                  </p>
                  <p
                    className="text-[clamp(8px,2vw,10px)] font-medium"
                    style={{ color: palette.ink }}
                  >
                    OK
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-auto rounded-lg bg-[#f7fbf3] p-[5%]">
              <p
                className="text-[clamp(7px,1.9vw,10px)] leading-[1.45]"
                style={{ color: palette.ink }}
              >
                “Raise tomatoes ₵2. Sell the rest before Friday.”
              </p>
            </div>
          </div>
        </WindowShell>
      </div>
    </>
  );
}

function Notely({ palette }: { palette: { ink: string; accent: string } }) {
  return (
    <>
      <div className="absolute left-[7%] top-[9%] w-[56%]">
        <Wordmark
          title="Notely"
          subtitle="A calmer place to write"
          ink={palette.ink}
          accent={palette.accent}
        />
      </div>

      <div className="absolute bottom-[8%] right-[6%] top-[33%] w-[58%]">
        <WindowShell>
          <div className="flex h-full">
            <div className="w-[26%] space-y-[7%] bg-[#eef2fb] p-[7%]">
              <div className="h-[4px] w-full rounded bg-[#3b5bdb]/50" />
              <div className="h-[4px] w-[80%] rounded bg-[#c9d4ee]" />
              <div className="h-[4px] w-[90%] rounded bg-[#dbe3f5]" />
              <div className="h-[4px] w-[70%] rounded bg-[#dbe3f5]" />
            </div>
            <div className="flex-1 space-y-[6%] p-[8%]">
              <div className="h-[6px] w-[55%] rounded bg-[#d7dde8]" />
              <div className="h-[4px] w-full rounded bg-[#eef1f6]" />
              <div className="h-[4px] w-[88%] rounded bg-[#eef1f6]" />
              <div className="h-[4px] w-[76%] rounded bg-[#eef1f6]" />
              <div className="h-[4px] w-[92%] rounded bg-[#eef1f6]" />
              <div className="h-[4px] w-[48%] rounded bg-[#eef1f6]" />
            </div>
          </div>
        </WindowShell>
      </div>

      <div className="absolute bottom-[9%] left-[7%] w-[28%] rounded-lg bg-white/70 p-[5%]">
        <p className="text-[clamp(6px,1.6vw,8px)]" style={{ color: palette.accent }}>
          Ideas
        </p>
        <div className="mt-[8%] h-[3px] w-full rounded bg-[#c9d4ee]" />
        <div className="mt-[8%] h-[3px] w-[70%] rounded bg-[#dbe3f5]" />
      </div>
    </>
  );
}

function HomeLab({ palette }: { palette: { ink: string; accent: string } }) {
  return (
    <>
      <div className="absolute left-[7%] top-[9%] w-[56%]">
        <Wordmark
          title="Home Lab"
          subtitle="Practice, not theory"
          ink={palette.ink}
          accent={palette.accent}
        />
      </div>

      <div className="absolute right-[7%] top-[13%] h-[30%] w-[28%]">
        <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
          <g stroke={palette.accent} strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6">
            <line x1="50" y1="18" x2="18" y2="52" />
            <line x1="50" y1="18" x2="82" y2="52" />
            <line x1="18" y1="52" x2="50" y2="86" />
            <line x1="82" y1="52" x2="50" y2="86" />
          </g>
          <g fill={palette.accent}>
            <circle cx="50" cy="18" r="5" />
            <circle cx="18" cy="52" r="4" />
            <circle cx="82" cy="52" r="4" />
            <circle cx="50" cy="86" r="5" />
          </g>
        </svg>
      </div>

      <div className="absolute bottom-[8%] left-[7%] w-[64%] overflow-hidden rounded-lg bg-[#0f2a28] p-[3.5%] font-mono text-[clamp(6px,1.8vw,9px)] leading-[1.8] text-[#9ee0d4]">
        <p>kali@lab:~$ nmap 10.0.2.5</p>
        <p className="text-[#6ee7b7]">open 22/tcp ssh</p>
        <p className="text-[#6ee7b7]">open 80/tcp http</p>
        <p>kali@lab:~$ _</p>
      </div>
    </>
  );
}

function Makersplace({ palette }: { palette: { ink: string; accent: string } }) {
  return (
    <>
      <div className="absolute left-[7%] top-[9%] w-[56%]">
        <Wordmark
          title="Makersplace"
          subtitle="From kits to competition"
          ink={palette.ink}
          accent={palette.accent}
        />
      </div>

      <div className="absolute right-[7%] top-[9%] flex items-center">
        {["FLL", "WRO", "AI"].map((badge, index) => (
          <span
            key={badge}
            className="flex h-[clamp(18px,4.6vw,24px)] w-[clamp(18px,4.6vw,24px)] items-center justify-center rounded-full border border-white/80 bg-white/70 text-[clamp(5px,1.4vw,7px)] font-semibold"
            style={{
              color: palette.ink,
              marginLeft: index === 0 ? 0 : "-6px",
            }}
          >
            {badge}
          </span>
        ))}
      </div>

      <div className="absolute bottom-[9%] left-[7%] right-[7%] flex items-end gap-[3%]">
        {[
          { color: "#f97316", height: "h-[15%]" },
          { color: "#1d4ed8", height: "h-[24%]" },
          { color: "#16a34a", height: "h-[19%]" },
          { color: "#facc15", height: "h-[12%]" },
        ].map((block) => (
          <div
            key={block.color}
            className={`w-[18%] rounded-t-md ${block.height}`}
            style={{ backgroundColor: block.color }}
          />
        ))}
        <div className="ml-auto flex h-[clamp(38px,10vw,56px)] w-[clamp(38px,10vw,56px)] items-center justify-center rounded-full bg-[#242424]/80">
          <RobotGlyph className="h-[70%] w-[70%] text-white" />
        </div>
      </div>
    </>
  );
}

export function ArchiveCover({ kind }: { kind: ArchiveKind }) {
  const art = ARCHIVE_ART[kind];

  return (
    <Frame color={art.from}>
      <div className="absolute left-[8%] top-[9%] w-[70%]">
        <Wordmark
          title={art.label}
          subtitle={art.detail}
          ink={art.ink}
          accent={art.accent}
        />
      </div>

      <p
        className="absolute bottom-[8%] right-[8%] text-[clamp(54px,13vw,96px)] font-medium leading-none tracking-[-0.055em]"
        style={{ color: art.ink }}
      >
        {art.stat}
      </p>

      {kind === "fll" && (
        <TrophyGlyph
          className="absolute bottom-[14%] left-[9%] h-[32%] w-[26%]"
          ink={art.ink}
          accent={art.accent}
        />
      )}
      {kind === "robofest" && (
        <>
          <MedalGlyph
            className="absolute left-[10%] top-[38%] h-[26%] w-[20%]"
            ink={art.ink}
            accent={art.accent}
          />
          <MapLines accent={art.accent} />
        </>
      )}
      {kind === "wro" && (
        <>
          <RobotGlyph
            className="absolute bottom-[10%] left-[9%] h-[36%] w-[24%]"
            style={{ color: art.ink }}
          />
          <AwardGlyph
            className="absolute left-[30%] top-[40%] h-[18%] w-[14%]"
            ink={art.ink}
            accent={art.accent}
          />
        </>
      )}
      {kind === "stem" && (
        <div className="absolute bottom-[11%] left-[8%] flex items-end gap-[6%]">
          {[0, 1, 2].map((index) => (
            <div key={index} className="flex flex-col items-center gap-[6px]">
              <RobotGlyph
                className="h-[clamp(26px,7vw,40px)] w-[clamp(26px,7vw,40px)]"
                style={{ color: art.ink, opacity: 0.85 - index * 0.15 }}
              />
              <span
                className="h-[clamp(8px,2.2vw,12px)] w-[clamp(18px,5vw,28px)] rounded-t-sm"
                style={{ backgroundColor: art.accent, opacity: 0.75 }}
              />
            </div>
          ))}
        </div>
      )}
      {kind === "events" && (
        <div className="absolute bottom-[12%] left-[8%] flex flex-wrap gap-[2%]">
          {["FLL", "WRO", "RoboFest"].map((event) => (
            <span
              key={event}
              className="rounded-full border px-[8px] py-[3px] text-[clamp(6px,1.8vw,9px)] font-medium"
              style={{ borderColor: art.accent, color: art.accent }}
            >
              {event}
            </span>
          ))}
        </div>
      )}

      {kind === "fll" && <StarBurst ink={art.accent} />}
      {kind === "events" && <StarBurst ink={art.accent} />}
    </Frame>
  );
}

function StarBurst({ ink }: { ink: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className="absolute right-[8%] top-[10%] h-[14%] w-[14%]"
      aria-hidden="true"
      style={{ color: ink }}
    >
      <path
        d="M50 4 L57 38 L88 24 L64 50 L94 62 L58 60 L60 94 L48 64 L18 82 L38 54 L6 44 L42 46 Z"
        fill="currentColor"
        opacity="0.35"
      />
    </svg>
  );
}

function MapLines({ accent }: { accent: string }) {
  return (
    <svg
      viewBox="0 0 120 60"
      className="absolute bottom-[12%] left-[8%] h-[22%] w-[36%]"
      aria-hidden="true"
      style={{ color: accent }}
    >
      <g stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" fill="none" opacity="0.55">
        <path d="M6 46 C24 30, 36 16, 58 22 S 92 40, 114 18" />
        <path d="M8 18 C30 34, 52 46, 78 34 S 102 16, 114 34" />
      </g>
      <g fill="currentColor">
        <circle cx="6" cy="46" r="2.5" />
        <circle cx="58" cy="22" r="2.5" />
        <circle cx="114" cy="18" r="2.5" />
        <circle cx="8" cy="18" r="2.5" />
        <circle cx="78" cy="34" r="2.5" />
      </g>
    </svg>
  );
}

function TrophyGlyph({
  className,
  ink,
  accent,
}: {
  className: string;
  ink: string;
  accent: string;
}) {
  return (
    <svg viewBox="0 0 64 80" className={className} aria-hidden="true">
      <g fill="none" stroke={accent} strokeWidth="2.4" strokeLinecap="round">
        <path d="M18 10 h28 v14 c0 10 -6 18 -14 18 s-14 -8 -14 -18 z" fill={ink} opacity="0.14" />
        <path d="M18 16 h-8 c0 9 4 13 10 13" />
        <path d="M46 16 h8 c0 9 -4 13 -10 13" />
        <path d="M32 42 v10" />
        <path d="M22 64 h20" />
        <path d="M26 54 h12 v10 h-12 z" fill={ink} opacity="0.14" />
      </g>
      <circle cx="32" cy="24" r="4" fill={accent} opacity="0.5" />
    </svg>
  );
}

function MedalGlyph({
  className,
  ink,
  accent,
}: {
  className: string;
  ink: string;
  accent: string;
}) {
  return (
    <svg viewBox="0 0 64 80" className={className} aria-hidden="true">
      <path d="M20 4 L32 30 L44 4" fill="none" stroke={accent} strokeWidth="3" opacity="0.55" />
      <circle cx="32" cy="48" r="20" fill={ink} opacity="0.14" stroke={accent} strokeWidth="2.5" />
      <path
        d="M32 36 l4 8 9 1 -6.5 6 1.5 9 -8 -4.5 -8 4.5 1.5 -9 -6.5 -6 9 -1 z"
        fill={accent}
        opacity="0.75"
      />
    </svg>
  );
}

function AwardGlyph({
  className,
  ink,
  accent,
}: {
  className: string;
  ink: string;
  accent: string;
}) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="26" r="16" fill={ink} opacity="0.12" stroke={accent} strokeWidth="2" />
      <path d="M22 40 L18 58 L32 50 L46 58 L42 40" fill={ink} opacity="0.18" stroke={accent} strokeWidth="2" />
      <path d="M32 18 l2.5 6 6.5 0.5 -5 4.5 1.5 6.5 -5.5 -3.5 -5.5 3.5 1.5 -6.5 -5 -4.5 6.5 -0.5 z" fill={accent} opacity="0.6" />
    </svg>
  );
}

function RobotGlyph({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="0 0 64 64" className={className} style={style} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="16" y="20" width="32" height="26" rx="6" fill="currentColor" opacity="0.12" />
        <path d="M32 20 v-8" />
        <circle cx="32" cy="10" r="3" fill="currentColor" />
        <circle cx="25" cy="31" r="2.6" fill="currentColor" stroke="none" />
        <circle cx="39" cy="31" r="2.6" fill="currentColor" stroke="none" />
        <path d="M25 39 h14" />
        <path d="M10 28 v8" />
        <path d="M54 28 v8" />
        <path d="M22 46 v8" />
        <path d="M42 46 v8" />
      </g>
    </svg>
  );
}

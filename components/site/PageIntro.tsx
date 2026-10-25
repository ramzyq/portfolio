import { cn } from "@/lib/utils";
import { CurrentlyAt } from "./CurrentlyAt";

const WIDTHS = {
  home: "max-w-[640px]",
  about: "max-w-[600px]",
  inner: "max-w-[520px]",
} as const;

export function PageIntro({
  badge,
  lead,
  mute,
  subtitle,
  width = "home",
  children,
}: {
  badge?: string;
  lead: string;
  mute?: string;
  subtitle?: string;
  width?: keyof typeof WIDTHS;
  children?: React.ReactNode;
}) {
  return (
    <header
      className={cn(
        "mx-auto flex flex-col items-center px-5 text-center md:px-0",
        WIDTHS[width]
      )}
    >
      {badge ? <div className="pill">{badge}</div> : <CurrentlyAt />}
      <h1 className="headline mt-10">
        {lead}
        {mute ? (
          <>
            {" "}
            <span className="headline-mute">{mute}</span>
          </>
        ) : null}
      </h1>
      {subtitle ? (
        <p className="mt-3 text-[13px] leading-[20px] text-body">{subtitle}</p>
      ) : null}
      {children ? <div className="mt-7">{children}</div> : null}
    </header>
  );
}

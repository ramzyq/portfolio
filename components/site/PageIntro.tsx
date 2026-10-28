import { CurrentlyAt } from "./CurrentlyAt";

export function PageIntro({
  badge,
  lead,
  mute,
  subtitle,
  children,
}: {
  badge?: string;
  lead: string;
  mute?: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="mx-auto flex w-full max-w-[680px] flex-col items-center px-6 text-center md:px-0">
      {badge ? <div className="pill">{badge}</div> : <CurrentlyAt />}
      <h1 className="headline headline-gradient mt-10">
        {lead}
        {mute ? (
          <>
            <br className="hidden md:block" />{" "}
            <span className="headline-mute">{mute}</span>
          </>
        ) : null}
      </h1>
      {subtitle ? (
        <p className="mt-3 max-w-[680px] text-pretty text-sm leading-5 text-body">
          {subtitle}
        </p>
      ) : null}
      {children ? <div className="mt-8">{children}</div> : null}
    </header>
  );
}

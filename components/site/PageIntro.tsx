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
    <header className="relative mx-auto flex w-full max-w-[680px] flex-col items-center px-6 text-center md:px-0">
      <span aria-hidden="true" className="hero-spark hero-spark-a" />
      <span aria-hidden="true" className="hero-spark hero-spark-b" />
      <span aria-hidden="true" className="hero-spark hero-spark-c" />
      <div className="hero-enter" style={{ animationDelay: "0ms" }}>
        {badge ? <div className="pill">{badge}</div> : <CurrentlyAt />}
      </div>
      <h1
        className="headline headline-gradient hero-enter mt-10"
        style={{ animationDelay: "90ms" }}
      >
        {lead}
        {mute ? (
          <>
            <br className="hidden md:block" />{" "}
            <span className="headline-mute">{mute}</span>
          </>
        ) : null}
      </h1>
      {subtitle ? (
        <p
          className="hero-enter mt-3 max-w-[680px] text-pretty text-sm leading-5 text-body"
          style={{ animationDelay: "170ms" }}
        >
          {subtitle}
        </p>
      ) : null}
      {children ? (
        <div className="hero-enter mt-8" style={{ animationDelay: "240ms" }}>
          {children}
        </div>
      ) : null}
    </header>
  );
}

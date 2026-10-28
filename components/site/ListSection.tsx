export function ListSection({
  label,
  count,
  section,
  children,
}: {
  label: string;
  count?: string;
  section?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      data-section={section}
      className="mx-auto w-full max-w-[652px] px-6"
    >
      <div className="mb-4 flex items-center justify-between text-xs font-medium text-body">
        <span>{label}</span>
        {count ? <span>{count}</span> : null}
      </div>
      <ul className="border-t border-line">{children}</ul>
    </section>
  );
}

export function Rail({ children }: { children: React.ReactNode }) {
  return (
    <div className="hide-scrollbar -mx-6 overflow-x-auto px-6 md:-mx-10 md:px-10">
      <div className="flex w-max gap-5 py-1 pr-10">{children}</div>
    </div>
  );
}

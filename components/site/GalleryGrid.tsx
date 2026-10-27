export function GalleryGrid({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-testid="gallery-grid"
      className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-x-6 gap-y-9 px-5 sm:grid-cols-2 lg:grid-cols-3 lg:px-8"
    >
      {children}
    </div>
  );
}

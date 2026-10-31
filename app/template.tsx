export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div data-page-transition className="page-enter">
      {children}
    </div>
  );
}

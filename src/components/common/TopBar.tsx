import { Link } from 'react-router-dom';

function TopBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed top-0 left-0 w-full box-border flex flex-row justify-between items-center gap-1 bg-[var(--bg-color-secondary)] p-3 z-50 border-t-[0.5px_solid_var(--line-color)] border-b-[0.5px_solid_var(--line-color-strong)]">
      <Link
        to="/"
        className="font-light text-xl px-1 no-underline !text-[var(--text-color-secondary)] hover:!text-[var(--text-color)]"
      >
        Pantheon
      </Link>
      {children}
    </div>
  );
}

export default TopBar;
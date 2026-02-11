import PantheonLogo from "./PantheonLogo";

function TopBar({ children }: { children: React.ReactNode }) {
	return (
		<div className="fixed top-0 left-0 w-full box-border flex flex-row justify-between items-center gap-1 bg-[var(--bg-color-secondary)] px-6 py-2 z-50 border-t-[0.5px_solid_var(--line-color)] border-b-[0.5px_solid_var(--line-color-strong)]">
			<PantheonLogo />
			{children}
		</div>
	);
}

export default TopBar;

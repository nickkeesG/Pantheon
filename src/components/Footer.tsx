import PantheonLogo from "./common/PantheonLogo";

const Footer = () => {
	return (
		<footer className="px-8 py-8 bg-[var(--bg-color-secondary)] border-t-[0.5px] border-t-[var(--line-color-strong)]">
			<div className="flex flex-col sm:flex-row justify-between items-center gap-4 max-w-[1024px] mx-auto w-full">
				<div className="flex flex-col items-center sm:items-start">
					<PantheonLogo />
					<div>
						An open-source project by{" "}
						<a
							href="https://mosaic-labs.org"
							target="_blank"
							rel="noopener noreferrer"
						>
							Mosaic Labs
						</a>{" "}
						| © {new Date().getFullYear()}
					</div>
					<div>
						Built with support from the{" "}
						<a
							href="https://funds.effectivealtruism.org/funds/far-future"
							target="_blank"
							rel="noopener noreferrer"
						>
							Long-Term Future Fund
						</a>
					</div>
					<div className="text-sm !text-[var(--text-color-tertiary)]">
						Feedback and support: hello@mosaic-labs.org
					</div>
				</div>

				<div className="flex flex-col items-center sm:items-end">
					<a
						href="https://www.lesswrong.com/posts/JHsfMWtwxBGGTmb8A/pantheon-interface"
						target="_blank"
						rel="noopener noreferrer"
					>
						Background
					</a>
					<a
						href="https://github.com/nickkeesG/Pantheon"
						target="_blank"
						rel="noopener noreferrer"
					>
						GitHub
					</a>
					<a
						href="https://github.com/nickkeesG/Pantheon/releases"
						target="_blank"
						rel="noopener noreferrer"
					>
						Changelog
					</a>
				</div>
			</div>
		</footer>
	);
};

export default Footer;

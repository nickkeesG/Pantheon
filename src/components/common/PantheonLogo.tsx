import { Link } from "react-router-dom";

function PantheonLogo() {
	return (
		<Link
			to="/"
			className="font-extralight text-2xl py-2 no-underline !text-[var(--text-color)] hover:!text-[var(--text-color)] w-fit"
		>
			Pantheon
		</Link>
	);
}

export default PantheonLogo;

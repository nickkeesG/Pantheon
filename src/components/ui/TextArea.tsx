import { type ComponentPropsWithoutRef, forwardRef } from "react";

function cn(...classes: (string | undefined | false)[]) {
	return classes.filter(Boolean).join(" ");
}

export const TextArea = forwardRef<
	HTMLTextAreaElement,
	ComponentPropsWithoutRef<"textarea">
>(({ className, ...props }, ref) => (
	<textarea
		ref={ref}
		className={cn(
			"w-full min-w-full max-w-full p-2.5 box-border border-[0.5px] border-[var(--line-color)] rounded bg-[var(--bg-color-secondary)] text-[var(--text-color)] font-ai text-[0.8em] overflow-hidden block m-auto focus:outline-none focus:border-[var(--text-color)]",
			className,
		)}
		{...props}
	/>
));
TextArea.displayName = "TextArea";

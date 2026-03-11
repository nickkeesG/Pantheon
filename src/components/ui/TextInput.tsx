import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { cn } from "./utils";

export const TextInput = forwardRef<
	HTMLInputElement,
	ComponentPropsWithoutRef<"input">
>(({ className, ...props }, ref) => (
	<input
		ref={ref}
		className={cn(
			"w-full p-2 box-border text-[var(--text-color)] bg-[var(--bg-color-secondary)] border-[0.5px] border-[var(--line-color)] rounded font-ai text-[0.8em] focus:outline-none focus:border-[var(--text-color)]",
			className,
		)}
		{...props}
	/>
));
TextInput.displayName = "TextInput";

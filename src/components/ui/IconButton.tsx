import { type ComponentPropsWithoutRef, forwardRef } from "react";

function cn(...classes: (string | undefined | false)[]) {
	return classes.filter(Boolean).join(" ");
}

const iconButtonBase =
	"cursor-pointer font-inherit text-[0.9em] bg-transparent text-[var(--text-color-secondary)] border-none rounded p-2 m-0 inline-flex items-center justify-center box-content transition-[background-color,border-color,color,opacity,transform] duration-200 hover:not-disabled:bg-[var(--highlight-weak)] active:not-disabled:opacity-70 disabled:text-[var(--text-color-tertiary)] disabled:cursor-default [&>svg]:w-full [&>svg]:h-full";

export const IconButtonLarge = forwardRef<
	HTMLButtonElement,
	ComponentPropsWithoutRef<"button">
>(({ className, ...props }, ref) => (
	<button
		ref={ref}
		className={cn(iconButtonBase, "w-5 h-5", className)}
		{...props}
	/>
));
IconButtonLarge.displayName = "IconButtonLarge";

export const IconButtonMedium = forwardRef<
	HTMLButtonElement,
	ComponentPropsWithoutRef<"button">
>(({ className, ...props }, ref) => (
	<button
		ref={ref}
		className={cn(iconButtonBase, "w-4 h-4 p-1.5", className)}
		{...props}
	/>
));
IconButtonMedium.displayName = "IconButtonMedium";

export const IconButtonSmall = forwardRef<
	HTMLButtonElement,
	ComponentPropsWithoutRef<"button">
>(({ className, ...props }, ref) => (
	<button
		ref={ref}
		className={cn(iconButtonBase, "w-3 h-3 p-1", className)}
		{...props}
	/>
));
IconButtonSmall.displayName = "IconButtonSmall";

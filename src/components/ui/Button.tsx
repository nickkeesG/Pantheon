import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { cn } from "./utils";

const buttonBase =
	"cursor-pointer font-inherit text-[0.9em] bg-transparent text-[var(--text-color-secondary)] border-[0.5px] border-[var(--line-color-strong)] rounded-[50px] px-4 py-2 m-1 transition-[background-color,border-color,color,opacity,transform] duration-200 hover:not-disabled:bg-[var(--highlight-weak)] active:not-disabled:opacity-70 disabled:text-[var(--text-color-tertiary)] disabled:border-[var(--line-color-stronger)] disabled:cursor-default";

export const Button = forwardRef<
	HTMLButtonElement,
	ComponentPropsWithoutRef<"button">
>(({ className, ...props }, ref) => (
	<button ref={ref} className={cn(buttonBase, className)} {...props} />
));
Button.displayName = "Button";

export const ButtonHighlighted = forwardRef<
	HTMLButtonElement,
	ComponentPropsWithoutRef<"button">
>(({ className, ...props }, ref) => (
	<button
		ref={ref}
		className={cn(buttonBase, "text-[var(--accent-color-coral)]", className)}
		{...props}
	/>
));
ButtonHighlighted.displayName = "ButtonHighlighted";

export const ButtonSmall = forwardRef<
	HTMLButtonElement,
	ComponentPropsWithoutRef<"button">
>(({ className, ...props }, ref) => (
	<button
		ref={ref}
		className={cn(buttonBase, "px-2 py-1", className)}
		{...props}
	/>
));
ButtonSmall.displayName = "ButtonSmall";

export const ButtonDangerous = forwardRef<
	HTMLButtonElement,
	ComponentPropsWithoutRef<"button">
>(({ className, ...props }, ref) => (
	<button
		ref={ref}
		className={cn(buttonBase, "text-[var(--accent-color-red)]", className)}
		{...props}
	/>
));
ButtonDangerous.displayName = "ButtonDangerous";

export const TextButton = forwardRef<
	HTMLButtonElement,
	ComponentPropsWithoutRef<"button">
>(({ className, ...props }, ref) => (
	<button
		ref={ref}
		className={cn(
			"cursor-pointer font-inherit text-[inherit] bg-transparent text-[var(--text-color-secondary)] border-none rounded-lg px-2 py-1 m-1 transition-[background-color,border-color,color,opacity,transform] duration-200 hover:not-disabled:bg-[var(--highlight-weak)] active:not-disabled:opacity-70 disabled:text-[var(--text-color-tertiary)] disabled:cursor-default",
			className,
		)}
		{...props}
	/>
));
TextButton.displayName = "TextButton";

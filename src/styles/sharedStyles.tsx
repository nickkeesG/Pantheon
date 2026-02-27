import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { FiX } from "react-icons/fi";
import { IoInformationCircleOutline } from "react-icons/io5";

function cn(...classes: (string | undefined | false)[]) {
	return classes.filter(Boolean).join(" ");
}

// --- Layout ---

export const ContainerVertical = forwardRef<
	HTMLDivElement,
	ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("flex flex-col w-full box-border", className)}
		{...props}
	/>
));
ContainerVertical.displayName = "ContainerVertical";

export const ContainerHorizontal = forwardRef<
	HTMLDivElement,
	ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("flex flex-row w-full box-border", className)}
		{...props}
	/>
));
ContainerHorizontal.displayName = "ContainerHorizontal";

export const Filler = forwardRef<
	HTMLDivElement,
	ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
	<div ref={ref} className={cn("flex-1", className)} {...props} />
));
Filler.displayName = "Filler";

// --- Buttons ---

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

// --- Icon buttons ---

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

// --- Composed icon buttons ---

export function ExitButtonLarge({
	className,
	...props
}: ComponentPropsWithoutRef<"svg">) {
	return (
		<FiX
			className={cn(
				iconButtonBase,
				"w-5 h-5 absolute top-1 right-1 cursor-pointer",
				className,
			)}
			{...props}
		/>
	);
}

export function ExitButtonSmall({
	className,
	...props
}: ComponentPropsWithoutRef<"svg">) {
	return (
		<FiX
			className={cn(
				iconButtonBase,
				"w-3 h-3 p-1 absolute top-1 right-1 cursor-pointer",
				className,
			)}
			{...props}
		/>
	);
}

export const InfoButton = forwardRef<
	HTMLButtonElement,
	ComponentPropsWithoutRef<"button">
>(({ className, children, ...props }, ref) => (
	<button
		ref={ref}
		className={cn(iconButtonBase, "w-5 h-5 p-1", className)}
		{...props}
	>
		{children ?? <IoInformationCircleOutline className="w-full h-full" />}
	</button>
));
InfoButton.displayName = "InfoButton";

// --- Form inputs ---

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

// --- Text elements ---

export const Hint = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn(
				"text-[0.85em] text-[var(--text-color-tertiary)]",
				className,
			)}
			{...props}
		/>
	),
);
Hint.displayName = "Hint";

export const SettingLabel = forwardRef<
	HTMLParagraphElement,
	ComponentPropsWithoutRef<"p">
>(({ className, ...props }, ref) => (
	<p
		ref={ref}
		className={cn(
			"text-[0.85em] mb-[5px] text-[var(--text-color-secondary)]",
			className,
		)}
		{...props}
	/>
));
SettingLabel.displayName = "SettingLabel";

// --- Toggle ---

export function ToggleSwitch({
	toggled,
	className,
	...props
}: ComponentPropsWithoutRef<"div"> & { toggled: boolean }) {
	return (
		<div
			className={cn(
				"w-[50px] h-[25px] rounded-[25px] relative cursor-pointer transition-[background-color] duration-300",
				className,
			)}
			style={{ backgroundColor: toggled ? "#4caf50" : "#ccc" }}
			{...props}
		/>
	);
}

export function ToggleKnob({
	toggled,
	className,
	...props
}: ComponentPropsWithoutRef<"div"> & { toggled: boolean }) {
	return (
		<div
			className={cn(
				"w-[23px] h-[23px] bg-white rounded-full absolute top-px transition-[left] duration-300",
				className,
			)}
			style={{ left: toggled ? "26px" : "1px" }}
			{...props}
		/>
	);
}

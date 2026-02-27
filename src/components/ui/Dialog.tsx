import * as DialogPrimitive from "@radix-ui/react-dialog";
import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { FiX } from "react-icons/fi";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export const DialogContent = forwardRef<
	HTMLDivElement,
	ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
	<DialogPrimitive.Portal>
		<DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/30" />
		<DialogPrimitive.Content
			ref={ref}
			className={`fixed left-1/2 top-[10%] z-50 -translate-x-1/2 bg-[var(--bg-color)] border-[0.5px] border-[var(--line-color)] rounded-[10px] p-5 pr-11 w-[min(550px,80vw)] max-h-[80vh] overflow-y-auto focus:outline-none ${className ?? ""}`}
			{...props}
		>
			{children}
			<DialogPrimitive.Close className="absolute top-1 right-1 box-content w-5 h-5 p-2 inline-flex items-center justify-center rounded cursor-pointer bg-transparent border-none text-[var(--text-color-secondary)] hover:bg-[var(--line-color)]">
				<FiX className="w-full h-full" />
			</DialogPrimitive.Close>
		</DialogPrimitive.Content>
	</DialogPrimitive.Portal>
));

DialogContent.displayName = "DialogContent";

export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;

import type React from "react";
import { useState } from "react";

interface ToggleButtonProps {
	initialState: boolean;
	onToggle: (state: boolean) => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
	initialState,
	onToggle,
}) => {
	const [isToggled, setIsToggled] = useState(initialState);

	const handleToggle = () => {
		const newState = !isToggled;
		setIsToggled(newState);
		onToggle(newState);
	};

	return (
		<div
			className="w-[50px] h-[25px] rounded-[25px] relative cursor-pointer transition-[background-color] duration-300"
			style={{ backgroundColor: isToggled ? "#4caf50" : "#ccc" }}
			onClick={handleToggle}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") handleToggle();
			}}
			role="switch"
			aria-checked={isToggled}
			tabIndex={0}
		>
			<div
				className="w-[23px] h-[23px] bg-white rounded-full absolute top-px transition-[left] duration-300"
				style={{ left: isToggled ? "26px" : "1px" }}
			/>
		</div>
	);
};

export default ToggleButton;

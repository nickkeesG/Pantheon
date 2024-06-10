import React, { useState } from 'react';
import { ToggleKnob, ToggleSwitch } from '../../styles/sharedStyles';

interface ToggleButtonProps {
  initialState: boolean;
  onToggle: (state: boolean) => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ initialState, onToggle }) => {
  const [isToggled, setIsToggled] = useState(initialState);

  const handleToggle = () => {
    const newState = !isToggled;
    setIsToggled(newState);
    onToggle(newState);
  };

  return (
    <ToggleSwitch toggled={isToggled} onClick={handleToggle}>
      <ToggleKnob toggled={isToggled} />
    </ToggleSwitch>
  );
};

export default ToggleButton;
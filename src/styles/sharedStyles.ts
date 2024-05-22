import styled from 'styled-components';
import { highlightOnHover } from './mixins';

export const ContainerVertical = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
`;

export const ContainerHorizontal = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  box-sizing: border-box;
`;

export const Button = styled.button`
  cursor: pointer;
  font-family: inherit;
  font-size: 0.9em;
  background: none;
  color: var(--text-color-dark);
  border: 0.5px solid var(--line-color-dark);
  border-radius: 50px;
  padding: 8px 16px;
  margin: 4px;
  ${highlightOnHover};

  &:active {
    opacity: 70%;
  }

  &:disabled {
    color: var(--text-color-darkest);
    border-color: var(--line-color-darker);
    cursor: default;
  }
`;

export const ButtonHighlighted = styled(Button)`
  color: var(--accent-color-coral);
`;

export const ButtonSmall = styled(Button)`
  padding: 4px 8px;
`;

export const ButtonDangerous = styled(Button)`
  color: var(--accent-color-red);
  padding: 8px 16px;
`;

export const TextButton = styled(Button)`
  background: none;
  border: none;
  border-radius: 8px;
  padding: 4px 8px;
  color: var(--text-color-dark);
  font-size: inherit;
`;

export const Icon = styled.div`
  width: 20px;
  height: 20px;
  background: none;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;

  img {
    max-width: 16px;
    max-height: 16px;
  }
`;

export const IconButtonLarge = styled(Button)`
  width: 20px;
  height: 20px;
  box-sizing: content-box;
  background: none;
  border: none;
  padding: 8px;
  margin: 0px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;

  svg {
    width: 100%;
    height: 100%;
  }
`;

export const IconButtonMedium = styled(IconButtonLarge)`
  width: 16px;
  height: 16px;
  padding: 6px;
`;

export const IconButtonSmall = styled(IconButtonLarge)`
  width: 12px;
  height: 12px;
  padding: 4px;
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  border: 0.5px solid var(--line-color);
  border-radius: 4px;
  width: 100%;
  height: 100%;
  margin: auto;
  display: block;
  background-color: var(--bg-color-light);
  color: var(--text-color);
  &:focus {
    outline: none;
    border-color: var(--line-color-light); 
  }
  overflow: hidden;
`;

export const TextInput = styled.input`
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  color: var(--text-color);
  background-color: var(--bg-color-light);
  border: 0.5px solid var(--line-color);
  border-radius: 4px;
  font-family: monospace;
  &:focus {
    outline: none;
    border-color: var(--line-color-light); 
  }
`;

export const Hint = styled.div`
  font-size: 0.8em;
  color: var(--text-color-darkest);
`;

export const Filler = styled.div`
  flex: 1;
`;

export const ToggleSwitch = styled.div<{ toggled: boolean }>`
  width: 50px;
  height: 25px;
  background-color: ${({ toggled }) => (toggled ? '#4caf50' : '#ccc')};
  border-radius: 25px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s;
`;

export const ToggleKnob = styled.div<{ toggled: boolean }>`
  width: 23px;
  height: 23px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  top: 1px;
  left: ${({ toggled }) => (toggled ? '26px' : '1px')};
  transition: left 0.3s;
`;
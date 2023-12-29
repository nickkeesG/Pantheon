import styled from 'styled-components';

export const Button = styled.button`
  cursor: pointer;
  font-family: inherit;
  font-size: 0.9em;
  background: none;
  color: var(--text-color-dark);
  border: 0.5px solid var(--line-color-dark);
  border-radius: 50px;
  padding: 4px 8px;
  margin: 4px;
  transition: background-color 0.2s, color 0.2s;

  &:hover {
    background-color: var(--highlight-weak);
  }

  &:active {
    opacity: 70%;
  }

  &:disabled {
    color: var(--text-color-darkest);
    border-color: var(--line-color-darker);
    cursor: default;
  }

  &:disabled:hover {
    background-color: transparent;
  }
`;

export const TextButton = styled(Button)`
  background: none;
  border: none;
  border-radius: 8px;
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
  font-size: 1em;
  background: none;
  border: none;
  padding: 8px;
  margin: 0px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;

  img {
    max-width: 16px;
    max-height: 16px;
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

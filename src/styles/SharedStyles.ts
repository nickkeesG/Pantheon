import styled from 'styled-components';

export const Button = styled.button`
  cursor: pointer;
  font-family: inherit;
  background-color: var(--accent-color);
  border: 1px solid var(--accent-color-dark);
  border-radius: 8px;
  padding: 4px 8px;
  &:hover {
    background-color: var(--accent-color-dark);
  }
`;

export const TextButton = styled.button`
  background: none;
  border: none;
  border-radius: 8px;
  color: var(--text-color-dark);
  padding: 4px;
  margin: 4px;
  cursor: pointer;
  font-family: inherit;
  &:hover {
    background-color: var(--highlight);
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid var(--line-color);
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
  border: 1px solid var(--line-color);
  border-radius: 4px;
  font-family: monospace;
  &:focus {
    outline: none;
    border-color: var(--line-color-light); 
  }
`;

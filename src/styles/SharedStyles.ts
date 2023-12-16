import styled from 'styled-components';

export const Button = styled.button`
  cursor: pointer;
  color: inherit;
  font-family: inherit;
  font-size: 0.9em;
  background: none;
  border: 0.5px solid var(--line-color-light);
  border-radius: 50px;
  padding: 4px 8px;
  margin: 4px;
  &:hover {
    background-color: var(--highlight);
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
  font-size: inherit;
  &:hover {
    background-color: var(--highlight);
  }
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

export const IconButton = styled.button`
  width: 20px;
  height: 20px;
  cursor: pointer;
  background: none;
  opacity: 70%;
  border: none;
  padding: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s;
  
  &:hover {
    background-color: var(--highlight);
  }

  &:active {
    opacity: 50%;
  }

  img {
    max-width: 16px;
    max-height: 16px;
  }
`;

export const IconButtonSmall = styled(IconButton)`
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

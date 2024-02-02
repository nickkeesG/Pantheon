import { css } from 'styled-components';


export const transition02 = css`
  transition: 
    background-color 0.2s, 
    border-color 0.2s, 
    color 0.2s, 
    opacity 0.2s, 
    transform 0.2s;
`;

export const highlightOnHover = css`
  ${transition02}

  &:hover {
    background-color: var(--highlight-weak);
  }

  &:disabled:hover {
    background-color: transparent;
  }
`;
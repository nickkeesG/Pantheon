import { css } from "styled-components";

export const styledBackground = css`
  background-color: var(--bg-color-secondary);
  border-radius: 4px;
`;

export const aiFont = css`
  font-family: 'Monaspace Neon';
  font-size: 0.8em;
`;

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

  &:hover:not(:disabled) {
    background-color: var(--highlight-weak);
  }
`;

export const emergeAnimation = css`
  @keyframes emerge {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  animation: emerge 0.3s ease-out forwards;
`;

export const fadeInAnimation = css`
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  animation: fadeIn 0.3s ease-out forwards;
`;

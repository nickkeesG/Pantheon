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

export const emergeFromBelowAnimation = css`
  @keyframes emergeFromBelow {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  animation: emergeFromBelow 0.3s ease-out forwards;
`;

export const emergeFromAboveAnimation = css`
  @keyframes emergeFromAbove {
    from {
      opacity: 0;
      transform: translateY(-16px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  animation: emergeFromAbove 0.3s ease-out forwards;
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

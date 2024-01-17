import React from "react";
import { Idea } from "../redux/models";
import { useAppSelector } from "../hooks";

const IdeaText: React.FC<{ idea: Idea }> = ({ idea }) => {
  const hasSurprisals = idea.textTokens
    && idea.tokenSurprisals
    && idea.textTokens.length > 0
    && idea.textTokens.length === idea.tokenSurprisals.length

  const isSynchronizerActive = useAppSelector(state => state.config.isSynchronizerActive);

  const getBackgroundColor = (surprisal: number) => {
    if (surprisal > 2) return 'var(--highlight-strong)';
    if (surprisal > 1) return 'var(--highlight)';
    if (surprisal > 0) return 'var(--highlight-weak)';
    return 'transparent';
  };

  return (
    <>
      {(hasSurprisals && isSynchronizerActive) ? (
        idea.textTokens.map((token, index) => (
          <span
            key={index}
            style={{ backgroundColor: getBackgroundColor(idea.tokenSurprisals[index]) }}
            title={`Surprisal: ${idea.tokenSurprisals[index].toFixed(2)}`}
          >
            {token}
          </span>
        ))
      ) : (
        idea.text
      )}
    </>
  )
}

export default IdeaText;
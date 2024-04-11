import React from "react";
import { Idea } from "../../../redux/models";
import { useAppSelector } from "../../../hooks";


const IdeaText: React.FC<{ idea: Idea }> = ({ idea }) => {
  const hasSurprisals = idea.textTokens
    && idea.tokenSurprisals
    && idea.textTokens.length > 0
    && idea.textTokens.length === idea.tokenSurprisals.length

  const isSynchronizerVisible = useAppSelector(state => state.config.isSynchronizerVisible);

  const getBackgroundColor = (surprisal: number) => {
    if (surprisal > 2) return 'var(--highlight-strong)';
    if (surprisal > 1) return 'var(--highlight)';
    if (surprisal > 0) return 'var(--highlight-weak)';
    return 'transparent';
  };

  const renderTextWithNewLines = (text: string) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index !== text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <>
      {(hasSurprisals && isSynchronizerVisible) ? (
        idea.textTokens.map((token, index) => (
          <React.Fragment key={index}>
            <span
              style={{ backgroundColor: getBackgroundColor(idea.tokenSurprisals[index]) }}
              title={`Surprisal: ${idea.tokenSurprisals[index].toFixed(2)}`}
            >
              {token}
            </span>
            {token.endsWith('\n') && <br />}
          </React.Fragment>
        ))
      ) : (
        renderTextWithNewLines(idea.text)
      )}
    </>
  )
}

export default IdeaText;
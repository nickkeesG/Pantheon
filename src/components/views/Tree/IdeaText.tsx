import React from "react";
import { Idea } from "../../../redux/models";
import { useAppSelector } from "../../../hooks";

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

  const renderTextWithNewLines = (text: string) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index !== text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const getMentionColoring = (tokens: string[], mentionText: string): { [tokenIndex: number]: [number, number] } => {
    const mentions: { [tokenIndex: number]: [number, number] } = {};
    const fullText = tokens.join('').toLowerCase();
    mentionText = mentionText.toLowerCase();
    const matchIndices: number[] = [];

    let matchIndex = fullText.indexOf(mentionText);
    while (matchIndex !== -1) {
      matchIndices.push(matchIndex);
      matchIndex = fullText.indexOf(mentionText, matchIndex + 1);
    }

    let stringIndex = 0;
    let currentMatchIndex = 0;
    tokens.forEach((token, tokenIndex) => {
      if (currentMatchIndex >= matchIndices.length) return;
      if (stringIndex + token.length > matchIndices[currentMatchIndex]) {
        const startColoring = Math.max(0, matchIndices[currentMatchIndex] - stringIndex);
        const endColoring = Math.min(token.length, matchIndices[currentMatchIndex] - stringIndex + mentionText.length);
        mentions[tokenIndex] = [startColoring, endColoring];
        if (matchIndices[currentMatchIndex] + mentionText.length <= stringIndex + token.length) {
          currentMatchIndex++;
        }
      }
      stringIndex += token.length;
    });
    return mentions;
  };

  const mentions = (idea.mention && idea.mention !== "") ? getMentionColoring(idea.textTokens, "@" + idea.mention) : {};

  return (
    <>
      {(hasSurprisals && isSynchronizerActive) ? (
        idea.textTokens.map((token, index) => (
          <React.Fragment key={index}>
            <span
              style={{ backgroundColor: getBackgroundColor(idea.tokenSurprisals[index]) }}
              title={`Surprisal: ${idea.tokenSurprisals[index].toFixed(2)}`}
            >
              {
                mentions[index] ? (
                  <>
                    {token.slice(0, mentions[index][0])}
                    <span style={{ color: 'var(--text-color-blue)' }}>
                      {token.slice(mentions[index][0], mentions[index][1])}
                    </span>
                    {token.slice(mentions[index][1])}
                  </>
                ) : token
              }
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
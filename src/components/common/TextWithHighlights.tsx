import React from 'react';

interface TextWithHighlightsProps {
  text: string;
  highlights: [number, number][];
}

const TextWithHighlights: React.FC<TextWithHighlightsProps> = ({ text, highlights }) => {
  // TODO This file could be optimized
  const highlightedText = highlights.reduce((acc, [start, end], index) => {
    const previousEnd = index === 0 ? 0 : highlights[index - 1][1];
    return acc.concat(
      text.slice(previousEnd, start),
      <span key={index} style={{ color: 'var(--accent-color-coral)' }}>
        {text.slice(start, end)}
      </span>
    );
  }, [] as React.ReactNode[]);

  if (highlights.length > 0) {
    const lastHighlightEnd = highlights[highlights.length - 1][1];
    highlightedText.push(text.slice(lastHighlightEnd));
  }

  return <span>{highlightedText.length > 0 ? highlightedText : text}</span>;
};

export default TextWithHighlights;

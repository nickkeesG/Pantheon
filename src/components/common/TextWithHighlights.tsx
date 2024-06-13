import React from 'react';

interface TextWithHighlightsProps {
  text: string;
  highlights: [number, number][];
}

const generateHighlightedText = (text: string, highlights: [number, number][]) => {
  const textParts: React.ReactNode[] = [];
  let lastEnd = 0;

  highlights.forEach(([start, end], index) => {
    // Add non-highlighted text
    textParts.push(text.slice(lastEnd, start));
    // Add highlighted text
    textParts.push(
      <span key={`${start}-${end}`} style={{ color: 'var(--accent-color-coral)' }}>
        {text.slice(start, end)}
      </span>
    );
    lastEnd = end;
  });

  // Add any remaining text after the last highlight
  if (lastEnd < text.length) {
    textParts.push(text.slice(lastEnd));
  }

  return textParts;
};

const TextWithHighlights: React.FC<TextWithHighlightsProps> = React.memo(({ text, highlights }) => {
  const highlightedText = generateHighlightedText(text, highlights);
  return <span>{highlightedText.length > 0 ? highlightedText : text}</span>;
});

export default TextWithHighlights;

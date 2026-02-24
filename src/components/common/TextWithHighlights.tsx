import React from "react";

const generateHighlightedTextWithLineBreaks = (
	text: string,
	highlights: [number, number][],
) => {
	const textParts: React.ReactNode[] = [];
	let lastEnd = 0;

	highlights.forEach(([start, end], _index) => {
		// Add non-highlighted text with line breaks
		const nonHighlighted = text
			.slice(lastEnd, start)
			.split("\n")
			.map((part, idx, arr) =>
				idx < arr.length - 1 ? (
					<React.Fragment key={`${lastEnd}-${start}-${idx}`}>
						{part}
						<br />
					</React.Fragment>
				) : (
					part
				),
			);
		textParts.push(...nonHighlighted);
		// Add highlighted text with line breaks
		const highlighted = text
			.slice(start, end)
			.split("\n")
			.map((part, idx, arr) => (
				<span
					key={`${start}-${end}-${idx}`}
					style={{ color: "var(--accent-color-coral)" }}
				>
					{idx < arr.length - 1 ? (
						<React.Fragment>
							{part}
							<br />
						</React.Fragment>
					) : (
						part
					)}
				</span>
			));
		textParts.push(...highlighted);
		lastEnd = end;
	});

	// Add any remaining text after the last highlight with line breaks
	if (lastEnd < text.length) {
		const remainingText = text
			.slice(lastEnd)
			.split("\n")
			.map((part, idx, arr) =>
				idx < arr.length - 1 ? (
					<React.Fragment key={`${lastEnd}-${text.length}-${idx}`}>
						{part}
						<br />
					</React.Fragment>
				) : (
					part
				),
			);
		textParts.push(...remainingText);
	}

	return textParts;
};

interface TextWithHighlightsProps {
	text: string;
	highlights: [number, number][];
}

const TextWithHighlights: React.FC<TextWithHighlightsProps> = React.memo(
	({ text, highlights }) => {
		const highlightedText = generateHighlightedTextWithLineBreaks(
			text,
			highlights,
		);
		return <span>{highlightedText.length > 0 ? highlightedText : text}</span>;
	},
);

export default TextWithHighlights;

import React, { useState } from "react";
import { Idea } from "../../../redux/models";
// import { useAppSelector } from "../../../hooks";
import TextWithHighlights from "../../common/TextWithHighlights";
import { getHighlightsArray } from "../../../styles/uiUtils.ts";

const IdeaText: React.FC<{ idea: Idea }> = ({ idea }) => {
  const [highlights] = useState<[number, number][]>(getHighlightsArray(idea));

  // const hasSurprisals = idea.textTokens
  //   && idea.tokenSurprisals
  //   && idea.textTokens.length > 0
  //   && idea.textTokens.length === idea.tokenSurprisals.length

  // const isSynchronizerActive = useAppSelector(state => state.config.isSynchronizerActive);

  // const getBackgroundColor = (surprisal: number) => {
  //   if (surprisal > 2) return 'var(--highlight-strong)';
  //   if (surprisal > 1) return 'var(--highlight)';
  //   if (surprisal > 0) return 'var(--highlight-weak)';
  //   return 'transparent';
  // };

  // const renderTextWithNewLines = (text: string) => {
  //   return text.split('\n').map((line, index) => (
  //     <React.Fragment key={index}>
  //       {line}
  //       {index !== text.split('\n').length - 1 && <br />}
  //     </React.Fragment>
  //   ));
  // };

  // TODO Make mentions / highlighting work with surprisals
  return (
    <TextWithHighlights text={idea.text} highlights={highlights} />
  )
}

export default IdeaText;
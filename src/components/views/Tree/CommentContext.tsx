import styled from "styled-components";
import { Comment } from "../../../redux/models";
import TextWithHighlights from "../../common/TextWithHighlights";
import { Hint, ModalHeader } from "../../../styles/sharedStyles";
import { useMemo } from "react";

const CommentContextPanel = styled.div`
  background-color: var(--bg-color);
  color: var(--text-color);
  padding: 20px 44px 20px 20px;
  border-radius: 10px;
  border: 0.5px solid var(--line-color);
  width: 50vw;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
`;

interface CommentContextProps {
  comment: Comment;
}

const CommentContext: React.FC<CommentContextProps> = ({ comment }) => {
  const historyExists = useMemo(() => comment.history !== undefined && comment.history?.length > 0, [comment.history]);
  const modifiedHistory = useMemo(() => comment.history?.map(([author, text]) =>
    [author === 'assistant' ? comment.daemonName : author.charAt(0).toUpperCase() + author.slice(1) + ' prompt', text]
  ), [comment.history, comment.daemonName]);


  return (<CommentContextPanel>
    <ModalHeader>Comment context</ModalHeader>
    <hr />
    <Hint>A record of the AI's internal chain-of-thought process leading up to this comment. <b>You can modify the system and user prompts in the settings.</b></Hint>
    <br />
    {historyExists && modifiedHistory?.map(([author, text], index) => (
      <div key={index}>
        {index === 0 && <b>{author}</b>}
        {index !== 0 && <b>{index}. {author}</b>}
        <div
          style={{
            padding: '20px 8px 20px 20px',
            fontFamily: author === comment.daemonName ? 'Monaspace Neon' : 'inherit',
            fontSize: author === comment.daemonName ? '0.8em' : 'inherit',
          }}
        >
          <TextWithHighlights text={text} highlights={[]} />
        </div>
      </div>
    ))}
    {!historyExists && <Hint>Comment history is not available for old comments.</Hint>}
  </CommentContextPanel>);
};

export default CommentContext;
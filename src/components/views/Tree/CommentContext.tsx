import styled from "styled-components";
import { Comment } from "../../../redux/models";
import TextWithHighlights from "../../common/TextWithHighlights";
import { Hint } from "../../../styles/sharedStyles";

const HistoryPanel = styled.div`
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
  return (<HistoryPanel>
    <h2>Comment History</h2>
    {comment.history?.map(([author, text], index) => (
      <div key={index}>
        <h3>{author.toUpperCase()}</h3>
        <br />
        <TextWithHighlights text={text} highlights={[]} />
        <br />
        <br />
      </div>
    ))}
    {(comment.history === undefined || comment.history?.length === 0) && <Hint>Comment history is not available for old comments.</Hint>}
  </HistoryPanel>);
};

export default CommentContext;
import styled from 'styled-components';
import { Tree } from '../redux/models';
import { Button } from '../styles/sharedStyles';
import { useNavigate } from 'react-router-dom';


const TreeListItemContainer = styled(Button)`
  width: 100%;
  margin: 0px;
  border: none;
  border-bottom: 0.5px solid var(--line-color);
  border-radius: 0px;
  text-align: start;
`;


const TreeListItem: React.FC<{ tree: Tree }> = ({ tree }) => {
  const navigate = useNavigate();

  const handleTreeClick = () => {
    navigate(`/tree/${tree.id}`)
  };

  return (
    <TreeListItemContainer onClick={handleTreeClick}>
      <h3>{tree.id}</h3>
      {tree.sectionIds.length} sections
    </TreeListItemContainer>
  )
}

export default TreeListItem;
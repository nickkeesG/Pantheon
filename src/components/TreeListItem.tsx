import styled from 'styled-components';
import { Tree } from '../redux/models';
import { ContainerHorizontal, ContainerVertical, IconButtonMedium } from '../styles/sharedStyles';
import { useNavigate } from 'react-router-dom';
import { MdDeleteOutline } from "react-icons/md";
import ButtonWithConfirmation from './ButtonWithConfirmation';
import { useState } from 'react';
import { useAppDispatch } from '../hooks';
import { deleteTreeAndContent } from '../redux/thunks';
import { highlightOnHover } from '../styles/mixins';


const TreeListItemContainer = styled(ContainerHorizontal)`
  width: 100%;
  margin: 0px;
  border: none;
  border-bottom: 0.5px solid var(--line-color);
  border-radius: 0px;
  color: var(--text-color-dark);
  text-align: start;
  ${highlightOnHover};
  padding: 8px 16px;
`;

const Header = styled.div`
  font-size: 1.1em;
  padding-bottom: 8px;
`;

const Description = styled.div`
  font-size: 0.9em;
`;


const TreeListItem: React.FC<{ tree: Tree }> = ({ tree }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [hovering, setHovering] = useState(false); // TODO Would be nice to have this as a custom hook

  const handleTreeClick = () => {
    navigate(`/tree/${tree.id}`)
  };

  const handleDelete = () => {
    dispatch(deleteTreeAndContent(tree.id));
  }

  return (
    <TreeListItemContainer
      onClick={handleTreeClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <ContainerVertical>
        <Header>{tree.id}</Header>
        <Description>
          {tree.sectionIds.length} sections
        </Description>
      </ContainerVertical>
      <div onClick={(evt) => evt.stopPropagation()}>
        {hovering &&
          <ButtonWithConfirmation
            confirmationText="Are you sure you want to delete this tree? This cannot be undone."
            onConfirm={handleDelete}
          >
            <IconButtonMedium>
              <MdDeleteOutline />
            </IconButtonMedium>
          </ButtonWithConfirmation>
        }
      </div>
    </TreeListItemContainer>
  )
}

export default TreeListItem;
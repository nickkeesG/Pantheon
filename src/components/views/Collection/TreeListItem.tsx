import styled from 'styled-components';
import { Tree } from '../../../redux/models';
import { ContainerHorizontal, ContainerVertical, IconButtonMedium, TextInput } from '../../../styles/sharedStyles';
import { useNavigate } from 'react-router-dom';
import { MdDeleteOutline } from "react-icons/md";
import ButtonWithConfirmation from '../../common/ButtonWithConfirmation';
import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { deleteTreeAndContent } from '../../../redux/thunks';
import { emergeFromAboveAnimation, highlightOnHover } from '../../../styles/mixins';
import { selectIdeasInTree } from '../../../redux/ideaSlice';
import { formatDistanceToNow } from 'date-fns';
import { FaRegEdit } from "react-icons/fa";
import { renameTree } from '../../../redux/treeSlice';


const TreeListItemContainer = styled(ContainerHorizontal)`
  width: 100%;
  margin: 0px;
  border: none;
  border-bottom: 0.5px solid var(--line-color);
  border-radius: 0px;
  color: var(--text-color-dark);
  text-align: start;
  ${highlightOnHover};
  ${emergeFromAboveAnimation};
  padding: 8px 16px;
`;

const ButtonContainer = styled(ContainerHorizontal)`
  flex-grow: 0;
  width: fit-content;
  min-width: 64px;
  padding-left: 8px;
`;

const Header = styled.div`
  min-height: 33px;
  font-size: 1.1em;
  box-sizing: border-box;
  align-items: center;
  display: flex;
`;

const Description = styled.div`
  margin-top: 8px;
  font-size: 0.9em;
`;


const TreeListItem: React.FC<{ tree: Tree, mostRecentEdit: Date }> = ({ tree, mostRecentEdit }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const ideas = useAppSelector(state => selectIdeasInTree(state, tree.id));
  const [hovering, setHovering] = useState(false); // TODO Would be nice to have this as a custom hook
  const [editing, setEditing] = useState(false);
  const treeListItemRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setEditing(false);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (treeListItemRef.current && !treeListItemRef.current.contains(event.target as Node)) {
      setEditing(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTreeClick = () => {
    navigate(`/tree/${tree.id}`)
  };

  const handleDelete = () => {
    dispatch(deleteTreeAndContent(tree.id));
  }

  return (
    <TreeListItemContainer
      ref={treeListItemRef}
      onClick={handleTreeClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <ContainerVertical>
        {editing ? (
          <TextInput
            onClick={(evt) => evt.stopPropagation()}
            value={tree.name || ''}
            onChange={(e) => { dispatch(renameTree({ treeId: tree.id, newName: e.target.value })) }}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <Header>{tree.name || 'New tree'}</Header>
        )}
        <Description>
          Sections: {tree.sectionIds.length} |
          Ideas: {ideas.length}
          {mostRecentEdit.getFullYear() > 2020 && // The first generated tree has id / timestamp 0
            <> | Last edit {formatDistanceToNow(mostRecentEdit, { addSuffix: true })}</>
          }
        </Description>
      </ContainerVertical>
      <ButtonContainer onClick={(evt) => evt.stopPropagation()}>
        {hovering &&
          <>
            <IconButtonMedium onClick={() => setEditing(true)}>
              <FaRegEdit />
            </IconButtonMedium>
            <ButtonWithConfirmation
              confirmationText="Are you sure you want to delete this tree? This cannot be undone."
              onConfirm={handleDelete}
            >
              <IconButtonMedium>
                <MdDeleteOutline />
              </IconButtonMedium>
            </ButtonWithConfirmation>
          </>
        }
      </ButtonContainer>
    </TreeListItemContainer>
  )
}

export default TreeListItem;
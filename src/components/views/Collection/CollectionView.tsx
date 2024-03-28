import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { ContainerVertical, TextButton } from '../../../styles/sharedStyles';
import TreeListItem from './TreeListItem';
import { createTree } from '../../../redux/thunks';
import { useNavigate } from 'react-router-dom';
import { selectTreesWithMostRecentEdit } from '../../../redux/treeSlice';


const List = styled.ul`
  width: 100%;
  padding: 0px;
  list-style-type: none;
  border-top: 0.5px solid var(--line-color);
`;


const CollectionView = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const trees = useAppSelector(state => selectTreesWithMostRecentEdit(state));

  const handleCreateTree = () => {
    const treeId = Date.now()
    dispatch(createTree(treeId));
    navigate(`/tree/${treeId}`);
  }

  return (
    <ContainerVertical style={{alignItems: 'center'}}>
      <ContainerVertical style={{
        maxWidth: '700px',
        alignItems: 'center',
        padding: '0px 16px'
      }}>
        <h1>Trees</h1>
        <TextButton style={{ alignSelf: 'end' }} onClick={handleCreateTree}>+ New tree</TextButton>
        <List>
          {Object.values(trees).map((tree) => (
            <li key={tree.id}>
              <TreeListItem tree={tree} mostRecentEdit={tree.mostRecentEdit} />
            </li>
          ))}
        </List>
      </ContainerVertical>
    </ContainerVertical>
  );
};

export default CollectionView;
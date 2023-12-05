import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { TextState } from '../redux/textSlice';

const Container = styled.div`
    padding: 10px 0px;
`;

const Atom = styled.div`
    padding: 10px;
    margin: 10px 0px;
    border: 0.1px solid #55555560;
    border-radius: 4px;
`

const HistoryContainer = () => {
    const atoms = useSelector((state: TextState) => state.atoms);
    return (
        <Container>
            // TODO Add some cute animation when adding blocks
            {atoms.map((atom, index) => (
                <Atom key={index}>
                    {atom}
                </Atom>
            ))}
        </Container>
    )
};

export default HistoryContainer;
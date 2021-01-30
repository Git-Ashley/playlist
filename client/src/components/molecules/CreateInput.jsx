import React, { useContext, useState } from 'react';
import styled, { ThemeContext } from 'styled-components';
import AddButton from 'components/atoms/buttons/AddButton';
import TextEntry from 'components/molecules/TextEntry';

const CreateInputContainer = styled.div`
  display: flex;
  & > :last-child {
    margin-left: 20px;
  }
`;

export default ({ onCreate }) => {
  const [inputMode, setInputMode] = useState(false);
  const theme = useContext(ThemeContext);

  if (inputMode) {
      return (<CreateInputContainer>
        <TextEntry onEnter={onCreate} />
        <button onClick={() => setInputMode(false)}>×</button>
      </CreateInputContainer>);
  } else {
    return <AddButton color={theme.secondaryInput} onClick={() => setInputMode(true)} />
  }
};

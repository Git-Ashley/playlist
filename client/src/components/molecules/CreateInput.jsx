import React, { useState } from 'react';
import styled from 'styled-components';
import AddButton from 'components/atoms/buttons/AddButton';

const StyledInput = styled.input`
  width: 100px;
`;

export default ({ onCreate }) => {
  const [inputMode, setInputMode] = useState(false);
  const [text, setText] = useState('');

  if (inputMode) {
      return (<div>
        <StyledInput
          value={text} onChange={e => setText(e.target.value)}
        />
        <button onClick={() => onCreate(text)}>✔</button>
        <button onClick={() => setInputMode(false)}>×</button>
      </div>);
  } else {
    return <AddButton onClick={() => setInputMode(true)} />
  }
};

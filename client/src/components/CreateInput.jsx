import React, { useState } from 'react';
import styled from 'styled-components';

const StyledInput = styled.input`
  width: 100px;
`;

export default ({
  createLabel = '+',
  onCreate,
}) => {
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
    return <button onClick={() => setInputMode(true)}>
      {createLabel}
    </button>;
  }
};
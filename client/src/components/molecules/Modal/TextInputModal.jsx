import React, { useState } from 'react';
import styled from 'styled-components';
import Confirm from 'components/molecules/Modal/Confirm';
import TextField from 'components/molecules/Fields/Text';
import Center from 'styles/Center';

export default ({ onConfirm, inputWidth = 120, error, ...props }) => {
  const [text, setText] = useState('');

  return (
    <Confirm
      onConfirm={() => onConfirm(text)}
      {...props}
    >
      <Center>
        <TextField
          onChange={e => setText(e.target.value)}
          value={text}
          error={error}
          inputWidth={inputWidth}
          marginBottom={35}
        />
      </Center>
    </Confirm>
  );
}

//Example usage:
/**
<TextInputModal
  header='Enter a course name'
  show={true}
  onConfirm={console.log}
  onClose={() => console.log('closed')}
/>

*/

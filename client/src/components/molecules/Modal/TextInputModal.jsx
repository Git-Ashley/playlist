import React, { useState } from 'react';
import styled from 'styled-components';
import Confirm from 'components/molecules/Modal/Confirm';
import TextInput from 'components/atoms/inputs/Text';
import Center from 'styles/Center';

export default ({ onConfirm, inputWidth = 120, ...props }) => {
  const [text, setText] = useState('');

  return (
    <Confirm
      onConfirm={() => onConfirm(text)}
      {...props}
    >
      <Center>
        <TextInput
          onChange={e => setText(e.target.value)}
          value={text}
          inputWidth={inputWidth}
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

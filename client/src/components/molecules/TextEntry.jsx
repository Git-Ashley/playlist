import React, { useState } from 'react';
import styled from 'styled-components';
import { BiCheck as CheckIcon } from 'react-icons/bi';
import Button from 'components/atoms/buttons/Button';

const SearchInput = styled.div`
  display: flex;

  & > * {
    height: 25px;
    border: none;
  }

  & >:nth-child(1) {
    width: ${({ inputWidth }) => inputWidth}px;
    border-bottom-left-radius: 5px;
    border-top-left-radius: 5px;
    background-color: ${({ theme }) => theme.secondaryInput};
    padding-left: 5px;
  }

  & >:nth-child(2) {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
    vertical-align: bottom;
    width: ${({ buttonWidth }) => buttonWidth}px;

    & > svg {
      vertical-align: middle;
    }
  }
`;

export default ({
  onEnter,
  placeholder,
  inputWidth = 80,
  buttonWidth = 40,
  icon = CheckIcon,
}) => {
  const [text, setText] = useState('');
  const Icon = icon;

  return (
    <SearchInput inputWidth={inputWidth} buttonWidth={buttonWidth}>
      <input type='text' value={text} placeholder={placeholder} onChange={e => setText(e.target.value)}/>
      <Button onClick={() => onEnter(text)}>
        <Icon />
      </Button>
    </SearchInput>
  );
}

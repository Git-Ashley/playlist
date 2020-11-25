import React from 'react';
import styled from 'styled-components';

export default styled.input`
  height: 25px;
  border: none;
  width: ${({ inputWidth }) => inputWidth}px;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.secondaryInput};
  padding-left: 5px;
`;

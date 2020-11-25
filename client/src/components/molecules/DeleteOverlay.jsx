import React from 'react';
import { BsX } from 'react-icons/bs';
import ActionableDisplay from 'components/atoms/ActionableDisplay';
import styled from 'styled-components';

const DeleteSymbol = styled(BsX)`
  height: ${({ size = 25 }) => size}px;
  width: ${({ size = 25 }) => size}px;
  position: absolute;
  top: 2px;
  right: 3px;
  cursor: pointer;
`;

export default ({ children, ...props }) => (
  <ActionableDisplay ActionComponent={DeleteSymbol} {...props}>
    {children}
  </ActionableDisplay>
);

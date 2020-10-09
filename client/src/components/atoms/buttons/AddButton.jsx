import React from 'react';
import styled from 'styled-components';
import { BsPlus } from 'react-icons/bs';

const StyledAddBtn = styled.div`
  font-size: 25px;
  border-radius: 50px;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  cursor: pointer;
  background-color: ${({ color }) => color};

  & > svg {
    vertical-align: top;
  }
`;

export default ({ onClick = () => {}, color, size  = 20}) => (
  <StyledAddBtn size={size} onClick={onClick} color={color}>
    <BsPlus size={size} />
  </StyledAddBtn>
)

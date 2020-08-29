import React from 'react';
import styled from 'styled-components';

const StyledAddBtn = styled.div`
  font-size: 25px;
  border-radius: 50px;
  border: 1px solid black;
  position: relative;
  width: 20px;
  height: 20px;
  cursor: pointer;
  background-color: ${({ color }) => color};

  &:before {
    position: absolute;
    top: -6px;
    left: 3px;
    content: '+';
  }
`;

export default ({ onClick = () => {}, color }) => {
  return <StyledAddBtn onClick={onClick} color={color} />
}

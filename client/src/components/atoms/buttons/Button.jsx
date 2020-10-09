import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  color: ${props => props.color || props.theme.secondaryText};
  background-color: ${props => props.backgroundColor || props.theme.secondary};
  appearance: none;
  border-style: none;
  border-radius: 5px;
  padding: 12px;
  display: flex;
  align-items: center;
  font-weight: bold;
  font-family: ${props => props.fontFamily || props.theme.font.family.default};
  cursor: pointer;
  text-decoration: none;

  &:focus, &:hover {
    box-shadow: inset 0 0 100px 100px rgba(255, 255, 255, 0.15);
    transition: 0.15s;
  }
`

export default ({ children, ...otherProps }) => <StyledButton {...otherProps}>
  {children}
</StyledButton>

import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';

const StyledStandardFlexContainer = styled.div`
  display: flex;
  height: 100%;

  & > :nth-child(1) {
    flex: 0;
  }

  & > :nth-child(2) {
    flex: 1;
    max-width: 100%;

  }

  & > :nth-child(3) {
    flex: 0;
  }

  @media screen and (min-width: ${props => props.width}px) {
    & > :nth-child(1) {
      flex: 1;
    }

    & > :nth-child(2) {
      flex: 0 0 ${props => props.width}px;
      width: ${props => props.width}px;
    }

    & > :nth-child(3) {
      flex: 1;
    }
  }
`;

export const NarrowStandardPageContainer = ({ children }) => {
  const themeContext = useContext(ThemeContext);

  return (
    <StyledStandardFlexContainer width={themeContext.screen.l}>
      <div />
      <div>{children}</div>
      <div />
    </StyledStandardFlexContainer>
  );
}

export const MedStandardPageContainer = ({ children }) => {
  const themeContext = useContext(ThemeContext);

  return (
    <StyledStandardFlexContainer width={1200}>
      <div />
      <div>{children}</div>
      <div />
    </StyledStandardFlexContainer>
  );
}

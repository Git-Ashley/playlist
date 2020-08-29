import React from 'react';
import styled from 'styled-components';

const StyledNarrowStandardFlexContainer = styled.div`
  display: flex;

  & > :nth-child(1) {
    flex: 0;
  }

  & > :nth-child(2) {
    flex: 1;
  }

  & > :nth-child(3) {
    flex: 0;
  }

  @media screen and (min-width: 992px) {
    & > :nth-child(1) {
      flex: 1;
    }

    & > :nth-child(2) {
      flex: 0 0 992px;
    }

    & > :nth-child(3) {
      flex: 1;
    }
  }
`;
export const NarrowStandardPageContainer = ({ children }) => (
  <StyledNarrowStandardFlexContainer>
    <div />
    <div>{children}</div>
    <div />
  </StyledNarrowStandardFlexContainer>
)

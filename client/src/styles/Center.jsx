import React from 'react';
import styled from 'styled-components';

const FlexCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default ({ children }) => <FlexCenter>{children}</FlexCenter>

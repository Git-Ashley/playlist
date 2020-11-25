import React from 'react';
import TextInput from 'components/atoms/inputs/Text';
import styled from 'styled-components';

const TextInputContainer = styled.div`
  & > :first-child {
    margin-bottom: 8px;
  }

  & > :last-child {
    margin-bottom: 30px;
  }
`;

export default ({ label, value, onChange, placeholder, inputWidth = 120 }) => (
  <TextInputContainer inputWidth={inputWidth}>
    <div>{label}</div>
    <TextInput { ...{ value, onChange, inputWidth, placeholder } } />
  </TextInputContainer>
)

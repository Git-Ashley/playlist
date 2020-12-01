import React from 'react';
import TextInput from 'components/atoms/inputs/Text';
import styled from 'styled-components';
import { BsFillExclamationTriangleFill as ErrMark } from "react-icons/bs";

const TextInputContainer = styled.div`
  position: relative;

  & > :first-child {
    margin-bottom: 8px;
  }

  padding-bottom: ${props => props.marginBottom}px;
`;

const ErrorText = styled.div`
  & > :first-child {
    margin-right: 4px;
    vertical-align: bottom;
  }
  position: absolute;
  top: 36px;
  left: 4px;
  color: red;
  font-size: 12px;
`;

export default ({
  label,
  value,
  error,
  onChange,
  placeholder,
  inputWidth = 120,
  marginBottom = 25,
}) => (
  <TextInputContainer {...{inputWidth, marginBottom}}>
    <div>{label}</div>
    <TextInput { ...{ value, onChange, inputWidth, placeholder } } />
    {error && <ErrorText><ErrMark />{error}</ErrorText>}
  </TextInputContainer>
)

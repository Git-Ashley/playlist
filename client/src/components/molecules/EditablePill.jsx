import React from 'react';
import styled from 'styled-components';
import ActionableDisplay from 'components/atoms/ActionableDisplay';

const StyledPill = styled.div`
  padding: 5px;
  border: 1px solid black;
  border-radius: 10px;
  background: ${({ userTag }) => userTag ? window.USER_TAG_COLOR : window.COURSE_TAG_COLOR};
  cursor: default;
`;

const DeleteSymbol = styled.span`
  box-shadow: 0 0 5px 1px rgb(180,180,180);
  background-color: rgba(180,180,180, 0.7);
  border-radius: 5px;
  padding: 0 3px;
  &:before {
    content: '×';
    font-weight: bold;
  }
  position: absolute;
  top: 5px;
  right: 2px;
  cursor: pointer;
`;

const EditablePill1 = ({ text, onDelete, userTag, ...otherProps }) => (
  <ActionableDisplay onAction={onDelete} ActionComponent={DeleteSymbol}>
    <StyledPill userTag={userTag} {...otherProps}>
      {text}
    </StyledPill>
  </ActionableDisplay>
);

export default EditablePill1;

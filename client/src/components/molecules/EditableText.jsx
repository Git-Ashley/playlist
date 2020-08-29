import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import ActionableDisplay from 'components/atoms/ActionableDisplay';

const StyledText = styled.div`
  padding: 6px 8px;
  cursor: default;
`;

const EditSymbol = styled.span`
  @media screen and (min-width: 992px) {
    display: inline;
  }

  height: 20px;
  width: 20px;
  border: 1px solid black;
  border-radius: 5px;
  &:before {
    content: '✎';
    font-size: 24px;
    position: absolute;
    top: -2px;
    right: 1px;
  }
  position: absolute;
  top: 4px;
  right: -24px;
  cursor: pointer;
  padding: 2px 2px 0 1px;
`;

export default ({ text, onUpdate, enableEdit = true, showActionOnHover, ...otherProps }) => {
  const [editMode, setEditMode] = useState(false);
  const [editableText, setEditableText] = useState(text);

  const handleUpdateDone = useCallback(() => {
    setEditMode(false);
    onUpdate(editableText);
  });

  if (!enableEdit) {
    return <StyledText>{text}</StyledText>
  }

  return <div {...otherProps}>
    { editMode ? (<>
      <input type='text' value={editableText} onChange={e => setEditableText(e.target.value)}/>
      <span><button onClick={handleUpdateDone}>✔</button></span>
    </>) : (
      <ActionableDisplay
        onAction={() => setEditMode(true)}
        showActionOnHover={showActionOnHover}
        ActionComponent={EditSymbol}
      >
        <StyledText>{text}</StyledText>
      </ActionableDisplay>
    )}
  </div>;
};

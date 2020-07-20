import React, { useState, useCallback } from 'react';
import styled from 'styled-components';

const StyledText = styled.div`
  padding: 6px 8px;
`;

const EditSymbol = styled.span`
  height: 20px;
  width: 20px;
  border: 1px solid black;
  border-radius: 5px;
  &:before {
    content: 'E';
  }
  position: absolute;
  top: 4px;
  right: -24px;
  cursor: pointer;
  padding: 2px 2px 0 1px;
`;

const EditableTextContainer = styled(StyledText)`
  position: relative;
`;
const EditableDisplay = ({ onEdit, editOnHover, children }) => {
  const [isHovered, setIsHovered] = useState();

  return <EditableTextContainer onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
    {children}
    {isHovered || !editOnHover ? <EditSymbol onClick={onEdit} /> : ''}
  </EditableTextContainer>;
};

export default ({ text, onUpdate, enableEdit, editOnHover }) => {
  const [editMode, setEditMode] = useState(false);
  const [editableText, setEditableText] = useState(text);

  const handleUpdateDone = useCallback(() => {
    setEditMode(false);
    onUpdate(editableText);
  });

  if (!enableEdit) {
    return <StyledText>{text}</StyledText>
  }

  return <div>
    { editMode ? (<>
      <input type='text' value={editableText} onChange={e => setEditableText(e.target.value)}/>
      <span><button onClick={handleUpdateDone}>✔</button></span>
    </>) : (
      <EditableDisplay onEdit={() => setEditMode(true)} editOnHover={editOnHover}>
        {text}
      </EditableDisplay>
    )}
  </div>;
};
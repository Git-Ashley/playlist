import React, { useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import ActionableDisplay from 'components/atoms/ActionableDisplay';
import FuriganaText, { getPairings } from 'components/molecules/FuriganaText';

const StyledText = styled.div`
  padding: 6px 8px;
  cursor: default;
`;

const EditSymbol = styled.span`
  @media screen and (min-width: ${props => props.theme.screen.l}px) {
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
    right: 3px;
  }
  position: absolute;
  top: 4px;
  right: -24px;
  cursor: pointer;
  padding: 2px 2px 0 1px;
`;

const StyledLink = styled.a`
  color: inherit;
  text-decoration: none;
`;

export default ({
  children,
  onUpdate,
  className,
  enableEdit = true,
  showActionOnHover,
  ...otherProps }) => {
  const [editMode, setEditMode] = useState(false);
  const [editableText, setEditableText] = useState(children);

  const handleUpdateDone = useCallback(() => {
    setEditMode(false);
    onUpdate(editableText);
  });

  const jishoLink = useMemo(() => {
    const furiganaPairings = getPairings(children);
    if (!Array.isArray(furiganaPairings)) {
      return;
    }

    return furiganaPairings.reduce((accum, {text}) => accum += text, '');
  }, [children]);

  const EditIcon = enableEdit ? EditSymbol : () => <div />;

  return <div className={className}>
    { editMode ? (<>
      <input type='text' value={editableText} onChange={e => setEditableText(e.target.value)}/>
      <span><button onClick={handleUpdateDone}>✔</button></span>
    </>) : (
      <ActionableDisplay
        onAction={e => setEditMode(true)}
        showActionOnHover={showActionOnHover}
        ActionComponent={EditIcon}
      >
        <StyledLink className='value' target="_blank" href={`https://jisho.org/search/${jishoLink}`}>
          <FuriganaText {...otherProps}>{children}</FuriganaText>
        </StyledLink>
      </ActionableDisplay>
    )}
  </div>;
};

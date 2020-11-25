import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import ActionableDisplay from 'components/atoms/ActionableDisplay';
import AddButton from 'components/atoms/buttons/AddButton';
import ListOverlay from 'components/atoms/ListOverlay';

export const PillContainer = styled.div`
  ${props => props.width ? `width: ${props.width}px;` : ''}
  text-align: center;

  & > * {
    margin: 0 5px 5px 0;
    vertical-align: middle;
    display: inline-block;
  }
`;

const StyledPill = styled.div`
  padding: 5px;
  border-radius: 10px;
  background: ${({ userTag, theme }) => userTag ? theme.userTag : theme.courseTag};
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

export const Pill = ({
  readOnly = false,
  text,
  onDelete,
  userTag,
  ...otherProps
}) => (
  <ActionableDisplay onAction={onDelete} ActionComponent={DeleteSymbol}>
    <StyledPill userTag={userTag} {...otherProps}>
      {text}
    </StyledPill>
  </ActionableDisplay>
);

export const NewTag = ({ onAddNewTag, tagOptions, userTag }) => {
  const themeContext = useContext(ThemeContext);

  return (<ListOverlay overlayPosition={{ bottom: 8, left: 8 }} options={tagOptions} onSelect={onAddNewTag}>
    <AddButton color={userTag ? themeContext.userTag : themeContext.courseTag} />
  </ListOverlay>);
}

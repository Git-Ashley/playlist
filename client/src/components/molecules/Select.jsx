import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import ListOverlay from 'components/atoms/ListOverlay';
import { BsFillCaretDownFill } from 'react-icons/bs';

const LabelWithArrowStyle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${({ arrowLeftAlign }) => !arrowLeftAlign && 'flex-direction: row-reverse;'}
  padding: 0 6px;

  cursor: pointer;

  background-color: ${props => props.backgroundColor};
  color: ${props => props.color};
  width: ${props => props.width}px;
  height: 30px;
  border-radius: 3px;

  > :nth-child(1) {
    margin: 0 4px;
  }

  > :nth-child(2) {
    flex: 1;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    margin: 0 4px;
    ${({ arrowLeftAlign }) => arrowLeftAlign && 'text-align: right;'}
  }
`;

const LabelWithArrow = ({ children, ...rest }) => (
  <LabelWithArrowStyle {...rest}>
    <BsFillCaretDownFill />
    <div>
      {children}
    </div>
  </LabelWithArrowStyle>
)

export default ({
  backgroundColor = 'white',
  color = '#444',
  arrowLeftAlign = false,
  width = 120,
  value,
  options,
  ...otherProps
}) => {
  let label = '';
  if (Array.isArray(options) && options.length) {
    if (typeof options[0] === 'string') {
      label = options.find(option => option === value);
    } else {
      const option = options.find(option => option.value === value);
      if (option) {
        label = option.label;
      } else {
        label = 'Not learnt';
      }
    }
  }
  return (
    <ListOverlay {...otherProps} value={value} options={options}>
      <LabelWithArrow
        {...{ backgroundColor, color, arrowLeftAlign, width }}
      >
        {label}
      </LabelWithArrow>
    </ListOverlay>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import ListOverlay from 'components/atoms/ListOverlay';
import { BsFillCaretDownFill } from 'react-icons/bs';

const LabelWithArrowStyle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${({ arrowRightAlign }) => arrowRightAlign && 'flex-direction: row-reverse;'}
  padding: 0 6px;

  cursor: pointer;

  background-color: ${props => props.backgroundColor};
  color: ${props => props.color};
  width: ${props => props.width}px;
  height: 30px;
  border-radius: 5px;

  > :nth-child(1) {
    margin: 0 4px;
    transform: rotate(${props => props.arrowRotation}deg);
  }

  > :nth-child(2) {
    flex: 1;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    margin: 0 4px;
    ${({ arrowRightAlign }) => !arrowRightAlign && 'text-align: right;'}
  }
`;

const Dropdown = ({
  backgroundColor = 'transparent',
  color = '#444',
  children,
  arrowRightAlign = false,
  arrowRotation = 0,
  width = 120,
  overlayWidth = 120,
  label,
  ...otherProps
}) => (
  <ListOverlay {...otherProps} component={children} overlayWidth={overlayWidth}>
    <LabelWithArrowStyle {...{ backgroundColor, color, arrowRightAlign, width, arrowRotation }}>
      <BsFillCaretDownFill />
      <div>
        {label}
      </div>
    </LabelWithArrowStyle>
  </ListOverlay>
);

export const IconItem = ({ icon, children, onClick = () => {} }) => {
  return <div onClick={onClick}>{icon}{children}</div>
};

const NestedDropdownArrow = styled(LabelWithArrowStyle)`
  padding: 0;
  > :nth-child(1) {
    margin: 0;
  }

  > :nth-child(2) {
    margin: 0;
  }

  height: unset;
`;

export const NestedDropdown = ({
  label,
  children,
  width = 120,
  persistOverlay = false,
}) => {
  const wrapperRef = useRef(null);
  const [wrapperWidth, setWrapperWidth] = useState(null);

  useEffect( () => {
    if(wrapperRef.current){
      const width  = wrapperRef.current.offsetWidth;
      setWrapperWidth(width);
    }
  }, [wrapperRef]);

  return (<ListOverlay
    component={children}
    overlayPosition={{ top: 0, right: wrapperWidth + 10 }}//Use forward ref on ListOVerlay if the padding of the option items becomes variable
    width={width}
    onSelect={(option, e) => {
      if (persistOverlay) {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
      }
    }}
    showOnHover
  >
    <NestedDropdownArrow
      ref={wrapperRef}
      arrowRightAlign
      arrowRotation={-90}
    >
      <BsFillCaretDownFill />
      <div>
        {label}
      </div>
    </NestedDropdownArrow>
  </ListOverlay>);
};

export default Dropdown;

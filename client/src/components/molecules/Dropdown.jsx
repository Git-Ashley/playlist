import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { BsFillCaretDownFill } from 'react-icons/bs';

const OverlayWrapper = styled.div`
  position: relative;
`;

const OptionsWrapper = styled.div`
  position: absolute;
  ${({ position }) => Object.entries(position).map(([key, val]) =>
    `${key}: ${val}px;`
  )}

  background: white;
  border-radius: 3px;
  z-index: 2;
  box-shadow: 3px 3px 5px rgba(0,0,0,0.4);
  min-width: 100%;

  & > * {
    padding: 5px;
    cursor: pointer;

    &:hover {
      background-color: #c5dfec;
    }
  }
`;

const OptionsOverlay = ({ options, onSelect, position }) => {
  if (typeof options[0] === 'string') {
    return (<OptionsWrapper position={position}>
      {options.map(option =>
        <div
          key={option}
          onClick={e => {
            e.stopPropagation();
            onSelect(option)
          }}
        >
          {option}
        </div>)
      }
    </OptionsWrapper>);
  } else {
    return (<OptionsWrapper position={position}>
      {options.map(({ label, value }) =>
        <div
          key={label}
          onClick={e => {
            e.stopPropagation();
            onSelect(value)
          }}
        >
          {label}
        </div>)
      }
    </OptionsWrapper>);
  }
}

const LabelWithArrowStyle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row-reverse;

  cursor: pointer;
  padding: 10px 5px 10px 10px;

  background-color: ${({ transparent, backgroundColor }) => transparent ?
    'transparent' : backgroundColor
  };
  color: ${props => props.color};
  height: 30px;
  border-radius: 3px;

  width: 120px;
  > :nth-child(1) {
    width: 25px;
  }

  > :nth-child(2) {
    flex: 1;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`;

const LabelWithArrow = ({ children, backgroundColor, color, transparent }) => (
  <LabelWithArrowStyle {...{ backgroundColor, color, transparent }}>
    <BsFillCaretDownFill />
    <div>
      {children}
    </div>
  </LabelWithArrowStyle>
)

export default ({
  options = [],
  onSelect,
  backgroundColor = 'white',
  color = '#444',
  label,
  children,
  transparent,
  overlayPosition = {
    top: 31,
    left: 0,
  },
  ...otherProps
}) => {
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    const clickHandler = () => {
      setShowOverlay(false);
    };

    document.addEventListener('click', clickHandler);

    return () => document.removeEventListener('click', clickHandler);
  }, []);

  const handleClickOverlayContainer = useCallback((e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setShowOverlay(true);
  }, [showOverlay]);

  const handleSelect = (option) => {
    onSelect(option);
    setShowOverlay(false);
  }

  return <OverlayWrapper onClick={handleClickOverlayContainer}>
    {label &&
      <LabelWithArrow {...{ backgroundColor, color, transparent }}>
        {label}
      </LabelWithArrow>
    }
    {!label && children}
    {showOverlay && options.length && <OptionsOverlay
        position={overlayPosition}
        options={options}
        onSelect={handleSelect}
      />
    }
  </OverlayWrapper>;
}

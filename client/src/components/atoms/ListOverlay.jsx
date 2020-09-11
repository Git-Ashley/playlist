import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

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
  width: ${props => props.width}px;

  & > * {
    padding: 5px;
    cursor: pointer;
    white-space: nowrap;

    &:hover {
      background-color: #c5dfec;
    }
  }
`;

const OptionsOverlay = ({ options = [], onSelect, position, component, ...otherProps }) => {
  if (component) {
    return (
      <OptionsWrapper
        {...otherProps}
        position={position}
        onClick={e => {
          e.stopPropagation();
          onSelect();
        }
      }>
        {component}
      </OptionsWrapper>
    );
  } else if (typeof options[0] === 'string') {
    return (<OptionsWrapper {...otherProps} position={position}>
      {options.map(option =>
        <div
          key={option}
          onClick={e => {
            e.stopPropagation();
            onSelect(option);
          }}
        >
          {option}
        </div>)
      }
    </OptionsWrapper>);
  } else {
    return (<OptionsWrapper {...otherProps} position={position}>
      {options.map(({ label, value }) =>
        <div
          key={label}
          onClick={e => {
            e.stopPropagation();
            onSelect(value);
          }}
        >
          {label}
        </div>)
      }
    </OptionsWrapper>);
  }
}

export default ({
  onSelect = () => {},
  options,
  showOnHover = false,
  component,
  children,
  overlayPosition = {
    top: 31,
    left: 0,
  },
  overlayWidth,
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

  const handleShowOverlayContainer = useCallback((e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setShowOverlay(true);
  }, []);

  const handleSelect = (option) => {
    onSelect(option);
    setShowOverlay(false);
  }

  const actionProps = showOnHover ? {
    onMouseEnter: handleShowOverlayContainer,
    onMouseLeave: () => setShowOverlay(false)
  } : {
    onClick: handleShowOverlayContainer
  };

  return <OverlayWrapper {...actionProps}>
    {children}
    {showOverlay && <OptionsOverlay
        position={overlayPosition}
        options={options}
        component={component}
        onSelect={handleSelect}
        width={overlayWidth}
      />
    }
  </OverlayWrapper>;
}

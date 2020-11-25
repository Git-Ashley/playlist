import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

const OverlayWrapper = styled.div`
  position: relative;
`;

const NoOptions = styled.div`
  color: rgba(0,0,0,0.4);
`;

const OptionsWrapper = styled.div`
  position: absolute;
  ${({ position = [] }) => Object.entries(position).map(([key, val]) =>
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
          onSelect(null, e);
        }
      }>
        {component}
      </OptionsWrapper>
    );
  } else if (!options.length) {
    return (<OptionsWrapper {...otherProps} position={position}>
      <NoOptions>No options</NoOptions>
    </OptionsWrapper>);
  } else if (typeof options[0] === 'string') {
    return (<OptionsWrapper {...otherProps} position={position}>
      {options.map(option =>
        <div
          key={option}
          onClick={e => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            onSelect(option, e);
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
            e.nativeEvent.stopImmediatePropagation();
            onSelect(value, e);
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
    setShowOverlay(!showOverlay);
  }, [showOverlay]);

  const handleSelect = (option, e) => {
    onSelect(option, e);
    setShowOverlay(false);
  }

  const actionProps = showOnHover ? {
    onMouseEnter: handleShowOverlayContainer,
    onMouseLeave: () => setShowOverlay(false)
  } : {};

  return <OverlayWrapper {...actionProps}>
    <div onClick={handleShowOverlayContainer}>
      {children}
    </div>
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

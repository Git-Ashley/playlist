import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import useWindowSize from 'hooks/useWindowSize';
import { ThemeContext } from 'styled-components';

const DisplayContainer = styled.div`
  position: relative;
`;

export default ({ onAction, showActionOnHover = true, children, ActionComponent }) => {
  const [showActionComponent, setShowActionComponent] = useState();
  const themeContext = useContext(ThemeContext);
  const size = useWindowSize();

  if (size.width > themeContext.screen.l) {
    return <DisplayContainer onMouseEnter={() => setShowActionComponent(true)} onMouseLeave={() => setShowActionComponent(false)}>
      {children}
      {showActionComponent || !showActionOnHover ? <ActionComponent showActionOnHover={showActionOnHover} onClick={onAction} /> : ''}
    </DisplayContainer>;
  } else {
    return <DisplayContainer onClick={() => setShowActionComponent(!showActionComponent)}>
      {children}
      {showActionComponent || !showActionOnHover ? <ActionComponent showActionOnHover={showActionOnHover} onClick={onAction} /> : ''}
    </DisplayContainer>
  }
};

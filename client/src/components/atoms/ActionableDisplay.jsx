import React, { useState } from 'react';
import styled from 'styled-components';
import useWindowSize from 'hooks/useWindowSize';

const EditableTextContainer = styled.div`
  position: relative;
`;

export default ({ onAction, showActionOnHover = true, children, ActionComponent }) => {
  const [showActionComponent, setShowActionComponent] = useState();
  const size = useWindowSize();

  if (size.width > window.LARGE) {
    return <EditableTextContainer onMouseEnter={() => setShowActionComponent(true)} onMouseLeave={() => setShowActionComponent(false)}>
      {children}
      {showActionComponent || !showActionOnHover ? <ActionComponent showActionOnHover={showActionOnHover} onClick={onAction} /> : ''}
    </EditableTextContainer>;
  } else {
    return <EditableTextContainer onClick={() => setShowActionComponent(!showActionComponent)}>
      {children}
      {showActionComponent || !showActionOnHover ? <ActionComponent showActionOnHover={showActionOnHover} onClick={onAction} /> : ''}
    </EditableTextContainer>
  }
};

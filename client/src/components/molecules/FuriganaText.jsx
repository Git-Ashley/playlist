import React, { useState, useMemo } from 'react';
import styled from 'styled-components';

export const getPairings = rawText => {
  const pairings = [];
  let str = rawText;
  let findFurigana = false;
  let currentText = '';
  while (str && str.length && str.length > 0) {
    if (!findFurigana) {
      const [part1, part2] = str.split(/\[(.+)/);
      currentText = part1;
      str = part2;
      findFurigana = true;
    } else {
      let [part1, part2] = str.split(/](.+)/);
      if (part1.includes(']')) {
        part1 = part1.slice(0, part1.length - 1);
      }
      pairings.push({ text: currentText, furigana: part1 });
      currentText = null;
      findFurigana = false;
      str = part2;
    }
  }

  if (currentText) {
    pairings.push({ text: currentText });
  }

  return pairings;
}
const StyledText = styled.span`
  position: relative;
  margin: 6px 0;
  cursor: default;
`;

const Furigana = styled.span`
  &:before {
    content: '${props => props.text}';
    font-size: ${props => props.furiganaFontSize}px;
    position: absolute;
    width: 100%;
    left: 0;
    white-space: nowrap;
  }
  width: 100%;
  position: absolute;
  top: ${props => props.furiganaTop}px;
  left: 0;
  padding: 2px 2px 0 1px;
`;

export default ({
  children,
  showFurigana = false,
  furiganaOnHover = true,
  furiganaFontSize = 9,
  furiganaTop = -16,
  ...otherProps
}) => {
  const [isHover, setIsHover] = useState(false);

  const furiganaPairings = useMemo(() => getPairings(children), [children]);

  if (!children) {
    return <StyledText>Loading...</StyledText>;
  } else if (typeof children !== 'string') {
    return <StyledText>Vocab is of wrong type: {children}</StyledText>
  }

  return <div
    onMouseEnter={() => setIsHover(true)}
    onMouseLeave={() => setIsHover(false)}
    {...otherProps}
  >
    {furiganaPairings.map(({ text, furigana }) => <StyledText>
      {text}
      {furigana && (showFurigana || (furiganaOnHover && isHover)) && <Furigana
        text={furigana}
        {...{ furiganaTop, furiganaFontSize }}
      />}
    </StyledText>)}
  </div>;
};

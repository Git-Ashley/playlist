import { useDispatch } from "react-redux";
import { useUser } from 'app/UserContext';
import {
  reviewCard,
  ignoreCard,
  unlearnCard,
  removeTag,
} from 'data/cardsSlice';
import styled, { ThemeContext } from "styled-components";
import React, { useMemo, useContext } from "react";
import Select from 'components/molecules/Select';
import Button from 'components/atoms/buttons/Button';
import { BiCog } from "react-icons/bi";
import Dropdown from 'components/molecules/Dropdown';

const ControlsContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const QuickReviewActions = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;

  & > * {
    height: 30px;
    width: 30px;
  }
`;

const QuickActions = styled.div`
  display: flex;
  margin-top: 20px;
  justify-content: space-around;

  & > * {
    height: 30px;
  }
`;

const IgnoreButton = styled(Button)`
  display:
  height: 30px;
  text-align: center;
`;

const Controls = ({ card, ...otherProps }) => {
  const [user] = useUser();
  const dispatch = useDispatch();
  const themeContext = useContext(ThemeContext);
  const isIgnored = Array.isArray(card.tags) && card.tags.includes('ignore');

  const options = useMemo(() => {
    const levels = user.default_levels;
    if (Array.isArray(levels)) {
      return levels.map(({ denomination, value }, i) => ({
        value: i,
        label: `${value} ${denomination}`,
      }));
    } else {
      return [];
    }
  });

  const currentLevel = card.level;

  const onReviewFinish = (level) => dispatch(reviewCard(card._id, level));
  const onIgnoreCard = () => dispatch(ignoreCard(card._id));
  const onUnignoreCard = () => dispatch(removeTag(card._id, 'ignore'));
  const onUnlearnCard = () => dispatch(unlearnCard(card._id));

  return (
    <ControlsContainer {...otherProps}>
      <Select
        options={options}
        onSelect={onReviewFinish}
        value={currentLevel}
      />
      <QuickReviewActions>
        <Button onClick={() => onReviewFinish(Math.max(currentLevel - 1, 0))}>-</Button>
        <Button onClick={() => onReviewFinish(currentLevel)}>o</Button>
        <Button onClick={() => onReviewFinish(Math.min(currentLevel + 1, options.length - 1))}>+</Button>
      </QuickReviewActions>
      <QuickActions>
        <Dropdown
          label={<BiCog style={{verticalAlign: 'middle'}} size={20} />}
          color={themeContext.secondaryText}
          backgroundColor={themeContext.secondary}
          overlayPosition={{ bottom: 31, left: 0 }}
          width={75}
          overlayWidth={70}
          arrowRightAlign
        >
          {!isIgnored && <div onClick={onIgnoreCard}>Ignore</div>}
          {isIgnored && <div onClick={onUnignoreCard}>Unignore</div>}
          <div onClick={onUnlearnCard}>Unlearn</div>
        </Dropdown>
      </QuickActions>
    </ControlsContainer>
  );
};

export default Controls;

import { useDispatch } from "react-redux";
import { useUser } from 'app/UserContext';
import { reviewCard, ignoreCard } from 'data/cardsSlice';
import styled from "styled-components";
import React from "react";

const ControlsContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const Controls = ({ card }) => {
  const user = useUser();
  const dispatch = useDispatch();

  const levels = user.default_levels;
  const currentLevel = card.level;

  const onReviewFinish = (level) => dispatch(reviewCard(card.id, level));
  const onIgnoreCard = () => dispatch(ignoreCard(card.id));

  return (
    <ControlsContainer>
      {levels.map(({ denomination, value }, i) => (
        <button
          key={denomination+value}
          onClick={() => onReviewFinish(i)}
          style={{backgroundColor: i === currentLevel ? 'green' : 'auto'}}
        >
          {`${value} ${denomination}`}
        </button>
      ))}
      <button onClick={onIgnoreCard}>ignore</button>
    </ControlsContainer>
  );
};

export default Controls;
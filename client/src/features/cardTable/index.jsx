import React, { useState } from 'react';
import styled from 'styled-components';
import ReviewActions from './CardReviewActions';
import Mems from './Mems';

const CardTable = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  padding: 20px;
`;

const CardRowContainer = styled.div`
  background-color: ${props => props.ignored ? '#e4955b' : 'inherit'};
  border-bottom: 1px solid black;
  border-right: 1px solid black;
  margin: 10px 0 10px;
  
  display: grid;
  grid-template-columns: 100px 200px 200px fit-content(200px) fit-content(200px);
  grid-template-rows: auto;
  grid-template-areas:
    "value definition review_date controls mems"
    "value definition primary_index controls mems"
    "value definition secondary_index controls mems";

  & > * {
    display: flex;
    justify-content: center;
    text-align: center;
    align-items: center;
    border-top: 1px solid black;
    border-left: 1px solid black;
  }
  
  & >:nth-child(1) {
    grid-area: value;
    font-size: 60px;
  }
  
  & >:nth-child(2) {
    grid-area: definition;
  }
  
  & >:nth-child(3) {
    grid-area: review_date;
  }
  
  & >:nth-child(4) {
    grid-area: primary_index;
  }
  
  & >:nth-child(5) {
    grid-area: secondary_index;
  }
  
  & >:nth-chilid(6) {
    grid-area: controls;
  }
  
  & >:nth-child(7) {
    grid-area: mems;
    padding: 10px;
  }
`;

const ShowHide = ({ text, show, onShow }) => {

  return (
    <div>
      { show ? (
        text
      ) : (
        <button onClick={onShow} style={{height:25}}>show</button>
      )}
    </div>
  );

};

const CardRow = ({ card }) => {
  const [show, setShow] = useState(false);

  return (
    <CardRowContainer ignored={card.tags.includes('ignore')}>
      <div>{card.value}</div>
      <ShowHide onShow={() => setShow(true)} show={show} text={card.definition} />
      <div>{new Date(card.review_date).toDateString()}</div>
      <div>frq index: {card.primary_index}</div>
      <div>kodansha ref: {card.secondary_index}</div>
      {show ?
        <>
          <ReviewActions card={card}/>
          <Mems card={card} />
        </> : ''
      }
    </CardRowContainer>
  );
};

export default ({ cards }) => (
  <CardTable>
    {cards.map(card => <CardRow key={card.id} card={card} />)}
    {!cards.length ? <div>No results</div> : ''}
  </CardTable>
);
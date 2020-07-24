import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import ReviewActions from './CardReviewActions';
import Mems from './Mems';
import EditableText from 'components/EditableText';
import { updateBlueprint } from 'data/cardsSlice';

const CardRowContainer = styled.div`
  background-color: ${props => props.ignored ? '#e4955b' : 'inherit'};
  border-bottom: 1px solid black;
  border-right: 1px solid black;
  margin: 10px 0;
  display: grid;
  
  width: 100%;
  grid-template-columns: ;
  grid-template-rows: auto;
  grid-template-areas:
    "index"
    "value"
    "definition"
    "primary_index"
    "secondary_index"
    "review_date"
    "controls"
    "mems";
      
  @media screen and (min-width: 992px) {
    grid-template-columns: 20px 100px 200px 200px fit-content(200px) fit-content(200px);
    grid-template-rows: auto;
    grid-template-areas:
      "index value definition review_date controls mems"
      "index value definition primary_index controls mems"
      "index value definition secondary_index controls mems";
    width: auto;
  }

  & > * {
    display: flex;
    justify-content: center;
    text-align: center;
    align-items: center;
    border-top: 1px solid black;
    border-left: 1px solid black;
    padding: 5px;
  }
  
  & >:nth-child(1) {
    grid-area: index;
  }
  
  & >:nth-child(2) {
    grid-area: value;
    font-size: 60px;
  }
  
  & >:nth-child(3) {
    grid-area: definition;
    @media screen and (min-width: 992px) {
      padding: 30px;
    }
  }
  
  & >:nth-child(4) {
    grid-area: review_date;
  }
  
  & >:nth-child(5) {
    grid-area: primary_index;
  }
  
  & >:nth-child(6) {
    grid-area: secondary_index;
  }
  
  & >:nth-chilid(7) {
    grid-area: controls;
  }
  
  & >:nth-child(8) {
    grid-area: mems;
    padding: 10px;
  }
`;

const CardRow = ({ card, i }) => {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  const onUpdateBlueprint = useCallback(updates => {
    dispatch(updateBlueprint(card._id, updates));
  }, [dispatch]);

  const ignored = card.tags && card.tags.includes('ignore');
  return (
    <CardRowContainer ignored={ignored}>
      <div>{i + 1}</div>
      <div>{card.value}</div>
      {show ? (
        <EditableText
          text={card.definition}
          onUpdate={newDefinition => onUpdateBlueprint({ definition: newDefinition })}
          enableEdit
        />
      ) : (
        <div>
          <button onClick={() => setShow(true)} style={{height:25}}>show</button>
        </div>
      )}
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

const CardTableContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: scroll;
    padding: 0 20px 20px;
`;

const TableHeader = styled.div`
  @media screen and (min-width: 992px) {
    position: sticky;
    top: 0;
  }
  height: 20px;
  width: 100%;
  background-color: rgb(222, 192, 135);
`;

export default ({ cards, onLoadMore, onSelectReview, onSelectLearn, count }) => (
  <CardTableContainer>
      <TableHeader style={{textAlign: 'center'}}>
        <button onClick={onSelectLearn}>Learn</button>
        <button onClick={onSelectReview}>Review</button>
        <span>{count} cards</span>
      </TableHeader>
    {cards.map((card, i) => <CardRow i={i} key={card._id} card={card} />)}
    {!cards.length ? (
      <div>No results</div>
    ) : (
        <div><button type="button" onClick={onLoadMore}>Load more...</button></div>
    )}
  </CardTableContainer>
);
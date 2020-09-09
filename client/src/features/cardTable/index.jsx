import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import ReviewActions from './CardReviewActions';
import Mems from './Mems';
import CardTags from './CardTags';
import EditableText from 'components/molecules/EditableText';
import { updateBlueprint } from 'data/cardsSlice';

const CardRowContainer = styled.div`
  background-color: ${props => props.ignored ? '#e4955b' : 'inherit'};
  border-bottom: 1px solid black;
  border-right: 1px solid black;
  margin: 10px 0;
  display: grid;

  width: 100%;
  grid-template-columns: auto;
  grid-template-rows: auto;
  grid-template-areas:
    "value"
    "def"
    "primary_index"
    "secondary_index"
    "review_date"
    "controls"
    "mems"
    "tags";
  grid-gap: 0px;

  @media screen and (min-width: ${props => props.theme.screen.l}px) {
    grid-template-columns: 100px 200px 200px fit-content(200px);
    grid-template-areas:
      "value def review_date mems"
      "value def controls mems"
      "value def controls mems"
      "tags primary_index other mems"
      "tags secondary_index other mems"
      "tags misc1 other mems";
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

  & > .value {
    grid-area: value;
    font-size: 60px;
  }

  & > .tags {
    grid-area: tags;
    padding: 5px 0 0 5px;
  }

  & > .def {
    grid-area: def;
    @media screen and (min-width: ${props => props.theme.screen.l}px) {
      padding: 30px;
    }
  }

  & > .review_date {
    grid-area: review_date;
  }

  & > .primary_index {
    grid-area: primary_index;
  }

  & > .secondary_index {
    grid-area: secondary_index;
  }

  & > .controls {
    grid-area: controls;
  }

  & > .mems {
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
      <div className='value'>{card.value}</div>
      {show ? (
        <>
          <EditableText
            className='def'
            text={card.definition}
            onUpdate={newDefinition => onUpdateBlueprint({ definition: newDefinition })}
          />
          <ReviewActions className='controls' card={card}/>
          <Mems className='mems' card={card} />
          <CardTags className='tags' cardId={card._id} userTags={card.tags} courseTags={card.course_tags} />
        </>
      ) : (
        <>
          <div className='def'>
            <button onClick={() => setShow(true)} style={{height:25}}>show</button>
          </div>
          <div className='tags' />
        </>
      )}
      <div className='review_date'>{new Date(card.review_date).toDateString()}</div>
      <div className='primary_index'>frq index: {card.primary_index}</div>
      <div className='secondary_index'>kodansha ref: {card.secondary_index}</div>
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
  @media screen and (min-width: ${props => props.theme.screen.l}px) {
    position: sticky;
    top: 0;
  }
  height: 20px;
  width: 100%;
  background-color: ${props => props.theme.subHeader};
`;

const SearchInput = styled.span`
  margin: 10px;

  & >:nth-child(1) {
    width: 30px;
  }

  & >:nth-child(2) {
  }
`;

export default ({ cards, onLoadMore, onSearchKanji, onSelectReview, onSelectLearn, count }) => {
  const [kanji, setKanji] = useState('');
  return (
    <CardTableContainer>
        <TableHeader style={{textAlign: 'center'}}>
          <button onClick={onSelectLearn}>Learn</button>
          <button onClick={onSelectReview}>Review</button>
          <span>{count} cards</span>
          <SearchInput>
            <input type='text' value={kanji} placeholder='kanji' onChange={e => setKanji(e.target.value)}/>
            <button onClick={() => onSearchKanji(kanji)}>🔎</button>
          </SearchInput>
        </TableHeader>
      {cards.map((card, i) => <CardRow i={i} key={card._id} card={card} />)}
      {!cards.length ? (
        <div>No results</div>
      ) : (
          <div><button type="button" onClick={onLoadMore}>Load more...</button></div>
      )}
    </CardTableContainer>
  )
}

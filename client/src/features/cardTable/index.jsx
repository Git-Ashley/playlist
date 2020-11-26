import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import ReviewActions from './CardReviewActions';
import Mems from './Mems';
import CardTags from './CardTags';
import Button from 'components/atoms/buttons/Button';
import EditableText from 'components/molecules/EditableText';
import { CardOutline } from 'styles/Cards';
import { updateBlueprint } from 'data/cardsSlice';
import { setPage, selectPage } from 'features/cardTable/cardTableSlice';
import Inputs from 'features/course/Inputs';

const CardRowContainer = styled(CardOutline)`
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
    "tags"
    "mems";
  grid-gap: 0px;

  @media screen and (min-width: ${props => props.theme.screen.l}px) {
    grid-template-columns: 100px 200px 200px fit-content(300px);
    grid-template-areas:
      "value def             review_date mems"
      "value def             controls    mems"
      "value def             controls    mems"
      "tags  primary_index   controls    mems"
      "tags  secondary_index controls    mems"
      "tags  misc1           controls    mems";
    width: auto;
  }

  & > * {
    display: flex;
    margin: auto;
    text-align: center;
    padding: 5px;
  }

  & > .value {
    grid-area: value;
    font-size: 60px;
  }

  & > .tags {
    grid-area: tags;
    padding: 5px 0 0 5px;
    display: block;
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
    justify-content: space-around;
  }

  & > .mems {
    position: relative;
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;

    @media screen and (min-width: ${props => props.theme.screen.l}px) {
      border-top-right-radius: inherit;
      border-bottom-left-radius: unset;
    }

    grid-area: mems;
    padding: 0 0 20px 0;
    max-height: 400px;
    overflow-y: hidden;
    background-color: ${props => props.theme.primary60};
    margin: initial;
  }
`;

const CardRow = ({ card, i }) => {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  const onUpdateBlueprint = useCallback(updates => {
    dispatch(updateBlueprint(card._id, updates));
  }, [dispatch]);

  const ignored = card.tags && card.tags.includes('ignore');
  const reviewDate = card.review_date ?
    new Date(card.review_date).toDateString() : '';

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
            <Button onClick={() => setShow(true)} style={{height:30}}>Reveal</Button>
          </div>
          <div className='tags' />
        </>
      )}
      <div className='review_date'>{reviewDate}</div>
      <div className='primary_index'>frq index: {card.primary_index}</div>
      <div className='secondary_index'>kodansha ref: {card.secondary_index}</div>
    </CardRowContainer>
  );
};

const CardTableContainer = styled.div`
    & > :first-child {
      display: block;
      @media screen and (min-width: ${props => props.theme.screen.l}px) {
        display: none;
      }
    }

    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    padding: 0 20px 20px;
`;

export default ({ cards }) => {
  const dispatch = useDispatch();
  const currentPage = useSelector(selectPage());
  const onLoadMore = useCallback(() => {
    dispatch(setPage(currentPage + 1));
  }, [dispatch]);

  return (
    <CardTableContainer>
      <Inputs />
      {cards.map((card, i) => <CardRow i={i} key={card._id} card={card} />)}
      {!cards.length ? (
        <div>No results</div>
      ) : (
          <div><button type="button" onClick={onLoadMore}>Load more...</button></div>
      )}
    </CardTableContainer>
  )
}

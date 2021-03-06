import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import ReviewActions from './CardReviewActions';
import Mems from './Mems';
import CardTags from './CardTags';
import EditableFuriganaText from './EditableFuriganaText';
import Button from 'components/atoms/buttons/Button';
import EditableText from 'components/molecules/EditableText';
import FuriganaText from 'components/molecules/FuriganaText';
import ActionableDisplay from 'components/atoms/ActionableDisplay';
import { BsX } from 'react-icons/bs';
import { CardOutline } from 'styles/Cards';
import { updateBlueprint } from 'data/cardsSlice';
import styled from 'styled-components';

const KanjiRowContainer = styled(CardOutline)`
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

  ${props => props.revealed ? `
    @media screen and (min-width: ${props.theme.screen.l}px) {
      grid-template-columns: 100px 200px 200px fit-content(300px);
      grid-template-areas:
        "value     value           review_date mems"
        "def       def             controls    mems"
        "audio     audio           controls    mems"
        "tags      primary_index   controls    mems"
        "tags      primary_index   controls    mems"
        "tags      book_ref        controls    mems"
        "examples  examples        examples    examples";
      width: auto;
    }
  `: `
    @media screen and (min-width: ${props.theme.screen.l}px) {
      grid-template-columns: 100px 200px 200px fit-content(300px);
      grid-template-areas:
        "value value           value"
        "def   def             review_date"
        "audio audio           review_date";
      width: auto;
    }
  `}

  & > * {
    display: flex;
    margin: auto;
    text-align: center;
    padding: 5px;
  }

  & > .value {
    grid-area: value;
    font-size: 30px;
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
    color: rgba(0,0,0,0.5);
    font-weight: bold;
  }

  & > .primary_index {
    grid-area: primary_index;
  }

  & > .controls {
    grid-area: controls;
    justify-content: space-around;
  }

  & > .book_ref {
    grid-area: book_ref;
  }

  & > .examples {
    grid-area: examples;
    padding: 0;

    > .example-pair {
      padding: 5px;

      > .example {
        margin: 4px;
      }

      > .answer {
        margin: 4px;
      }
    }
  }

  & > .mems {
    min-height: 110px;
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

const DeleteSymbol = styled(BsX)`
  cursor: pointer;
`;

const BlurText = styled.div`
  filter: blur(10px);
  cursor: default;
  &:hover {
    filter: none;
  }
`;

export default ({ card, i }) => {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  const onUpdateBlueprint = useCallback(updates => {
    dispatch(updateBlueprint(card._id, updates));
  }, [dispatch, card._id]);

  const reviewDate = card.review_date ?
    new Date(card.review_date).toDateString() : 'Unlearnt';

  const ignored = card.tags && card.tags.includes('ignore');
  return (
    <KanjiRowContainer revealed={show} ignored={ignored}>
      <EditableFuriganaText
        furiganaFontSize={12}
        furiganaTop={-15}
        enableEdit={show}
        className='value'
        onUpdate={newDefinition => onUpdateBlueprint({ value: newDefinition })}
      >
        {card.value}
      </EditableFuriganaText>
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
          <div className='primary_index'>Index: {card.primary_index}</div>
          {card.attributes && card.attributes.map(({ key, value }) => {
            if (key === 'audio') {
              return (
                <ActionableDisplay
                  onAction={() => onUpdateBlueprint({
                    attributes: card.attributes.filter(({ key }) => key !== 'audio')
                  })}
                  ActionComponent={DeleteSymbol}
                >
                  <audio className='audio' controls>
                    <source src={`/static/audio/${value}`} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </ActionableDisplay>
              );
            } else if (key === 'book_location') {
              return <div className="book_ref">{value}</div>;
            } else {
              return '';
            }
          })}
          {card.examples && card.examples.length && <div className="examples">
            {card.examples.map(({ example, answer }) => <div className="example-pair">
              <FuriganaText className='example'>{example}</FuriganaText>
              <BlurText className='answer'>{answer}</BlurText>
            </div>)}
          </div>}
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
    </KanjiRowContainer>
  );
};

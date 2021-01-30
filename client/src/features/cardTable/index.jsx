import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCourse } from 'app/CourseContext';
import styled from 'styled-components';
import Button from 'components/atoms/buttons/Button';
import { setPage, selectPage } from 'features/cardTable/cardTableSlice';
import Inputs from 'features/course/Inputs';
import LoadingPlaceholder from 'components/molecules/LoadingPlaceholder';
import KanjiRow from './KanjiRow';
import VocabRow from './VocabRow';

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
  const [course, setCourse, isLoading] = useCourse();
  const currentPage = useSelector(selectPage());
  const onLoadMore = useCallback(() => {
    dispatch(setPage(currentPage + 1));
  }, [dispatch, currentPage]);

  if (isLoading) {
    return <LoadingPlaceholder />
  }

  return (
    <CardTableContainer>
      <Inputs />
      {course.isKanji() && cards.map((card, i) => <KanjiRow i={i} key={card._id} card={card} />)}
      {!course.isKanji() && cards.map((card, i) => <VocabRow i={i} key={card._id} card={card} />)}
      {!cards.length ? (
        <div>No results</div>
      ) : (
          <div><Button onClick={onLoadMore}>Load more...</Button></div>
      )}
    </CardTableContainer>
  )
}

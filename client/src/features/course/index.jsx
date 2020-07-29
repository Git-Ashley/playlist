import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import styled from 'styled-components';
import { getCards, selectCards } from "data/cardsSlice";
import CardTable from 'features/cardTable';
import Inputs from './Inputs';
import { CourseProvider } from 'app/CourseContext';

const useSearchCards = () => {
  const [searchOrder, setSearchOrder] = useState([]);
  const [count, setCount] = useState(null);

  const cards = useSelector(selectCards(searchOrder));
  const dispatch = useDispatch();
  const searchCards = useCallback( searchParams => {
    const getCardsRequest = async () => {
      const { searchOrder, count } = await dispatch(getCards(searchParams));
      setSearchOrder(searchOrder);
      setCount(count);
    };
    getCardsRequest();
  }, [dispatch]);

  return [cards, count, searchCards];
};

const CardViewer = styled.div`
  display: flex;
  height: 100%;
  
  & >:nth-child(1) {
    padding: 20px;
    flex: 1;
    display: none;
    
    @media screen and (min-width: 992px) {
      display: block;
    }
  }
  
  & >:nth-child(2) {
    flex: 4;
  }
`;

export default () => {
  const [cards, count, searchCards] = useSearchCards();

  const [page, setPage] = useState(1);

  //TODO: const [includeUserTags, setIncludeUserTags] = useState([]);
  const [excludeUserTags, setExcludeUserTags] = useState(['ignore']);
  const [includeCourseTags, setIncludeCourseTags] = useState([]);
  //TODO: const [excludeCourseTags, setExcludeCourseTags] = useState([]);

  const [sortField, setSortField] = useState('review_date');
  const [sortMode, setSortMode] = useState(1);
  const [reviewDateMode, setReviewDateMode] = useState('BEFORE');

  const apply = useCallback(() => {
    console.log('called.');
    searchCards({
      excludeUserTags,
      //excludeCourseTags,
      //includeUserTags,
      includeCourseTags,
      reviewDateMode,
      sortField,
      sortMode,
    });
    setPage(1);
  }, [excludeUserTags, includeCourseTags, reviewDateMode, sortField, sortMode]);

  const onSelectLearn = useCallback(() => {
    const newExcludeUserTags = ['ignore'];
    const newIncludeCourseTags = [];
    const newSortField = 'primary_index';
    const newSortMode = 1;
    const newReviewDateMode = 'UNLEARNT';

    setExcludeUserTags(newExcludeUserTags);
    setIncludeCourseTags(newIncludeCourseTags);
    setSortField(newSortField);
    setSortMode(newSortMode);
    setReviewDateMode(newReviewDateMode);

    searchCards({
      excludeUserTags: newExcludeUserTags,
      includeCourseTags: newIncludeCourseTags,
      reviewDateMode: newReviewDateMode,
      sortField: newSortField,
      sortMode: newSortMode,
    });
  }, [apply]);

  const onSelectReview = useCallback(() => {
    const newExcludeUserTags = ['ignore'];
    const newIncludeCourseTags = [];
    const newSortField = 'review_date';
    const newSortMode = 1;
    const newReviewDateMode = 'BEFORE';

    setExcludeUserTags(newExcludeUserTags);
    setIncludeCourseTags(newIncludeCourseTags);
    setSortField(newSortField);
    setSortMode(newSortMode);
    setReviewDateMode(newReviewDateMode);

    searchCards({
      excludeUserTags: newExcludeUserTags,
      includeCourseTags: newIncludeCourseTags,
      reviewDateMode: newReviewDateMode,
      sortField: newSortField,
      sortMode: newSortMode,
    });
  }, [apply]);

  useEffect(() => {
    apply();
  }, []);

  const cardSlice = cards.slice(0, 50*page);
  return (
    <CourseProvider>
      <CardViewer>
        <div>
          <Inputs
            onApply={apply}
            {...{
              excludeUserTags,
              includeCourseTags,
              reviewDateMode,
              sortField,
              sortMode,
              setExcludeUserTags,
              setIncludeCourseTags,
              setReviewDateMode,
              setSortField,
              setSortMode,
            }}
          />
        </div>
        <CardTable
          onSelectLearn={onSelectLearn}
          onSelectReview={onSelectReview}
          cards={cardSlice}
          count={count}
          onLoadMore={() => setPage(page+1)}
          onSearchKanji={kanji => searchCards({ value: kanji })}
        />
      </CardViewer>
    </CourseProvider>
  );
};
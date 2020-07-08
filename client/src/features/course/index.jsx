import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import styled from 'styled-components';
import { getCards, selectCards } from "data/cardsSlice";
import CardTable from 'features/cardTable';
import Inputs from './Inputs';

const useSearchCards = () => {
  const [searchOrder, setSearchOrder] = useState([]);

  const cards = useSelector(selectCards(searchOrder));
  const dispatch = useDispatch();
  useEffect( () => {
    const getCardsRequest = async () => {
      const cardOrder = await dispatch(getCards());
      setSearchOrder(cardOrder);
    };
    getCardsRequest();
  }, [dispatch]);

  return cards;
};

const CardViewer = styled.div`
  display: flex;
  background: #d8bc7a;
  height: 100%;
  
  & >:nth-child(1) {
    flex: 1;
  }
  
  & >:nth-child(2) {
    flex: 4;
  }
`;

export default () => {
  const cards = useSearchCards();
  //const { courseId } = useParams();
  //console.log('courseId:', courseId);

  // State -> UI display
  // - excludeUserTags:
  // - excludeCourseTags:
  // - includeUserTags
  // - includeCourseTags
  // - reviewDateMode: Before/After/All <-- For now, just do Before/All. Which will be displayed in UI as single
  //   checkbox 'needs reviewing'
  // - Sorting - Review Date (UserCardStats), primary_index, secondary_index

  // Phase 2: Just includeUserTags, sorting, and 'show ignored' checkbox (which will essentially be the precursor
  // to the exclude checkbox table). Manually enter user tags in mongo for now, since no create tag fnality.
  // !!!!!! KODANSHA TAG IS A COURSE TAG. FUCK. WILL NEED TO IMPLEMENT COURSE TAGS NOW. Or shall I even bother?
  // This will require all of that outer join stuff on the BE too. Maybe I will leave tagging for phase 3 or 4...
  // shit wait, i'm gonna hvae to do the outer join stuff either way cos of the ignore tag, and sorting on primary/
  // secondary/tertiary indexes. Ugh. Just do the outer join stuff now, then see if I will bother with tag stuff.
  // (though it'll be just course tags now, which will also need manually adding to 'course'). Can hardly see the
  // point tbh until the whole of tagging is implemented.

  // Phase 3: Ability to create new tags, and add or remove tags. Course level tags.

  // Phase 4: Exclude tags++

  // To implement the include/exclude and course/user stuff... either 2 separate exclude + include tables, segmented
  // by course/user, or a single table (Again segmented by user/course), with some sort of '3 way check' widget.

  // Once you're on a course page, just default the query params. There is no 'routing' necessary here.
  // You are not on a different 'page' at any point. The All/Review/Learn queries are just short cuts.

  //TODO Phase 4 query sharing: 'Share query with friend', or adding abilit yto save queries on the course level.
  return (
    <CardViewer>
      <Inputs />
      <CardTable cards={cards} />
    </CardViewer>
  );
};
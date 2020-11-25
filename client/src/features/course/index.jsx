import React, { useCallback, useEffect, useState } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import styled from 'styled-components';
import { selectCards } from "data/cardsSlice";
import { selectSearchOrder, selectPage } from 'features/cardTable/cardTableSlice';
import CardTable from 'features/cardTable';
import Inputs from './Inputs';
import { MedStandardPageContainer } from 'components/layouts/pageContainers';
import { CourseProvider } from 'app/CourseContext';
import CourseConfig from 'features/course/Settings';

const CardViewer = styled.div`
  display: flex;
  height: 100%;

  & >:nth-child(1) {
    padding: 20px;
    flex: 1;
    display: none;

    @media screen and (min-width: ${props => props.theme.screen.l}px) {
      display: block;
    }
  }

  & >:nth-child(2) {
    flex: 4;
  }
`;

const Course = () => {
  const searchOrder = useSelector(selectSearchOrder());
  const cards = useSelector(selectCards(searchOrder || []));
  const page = useSelector(selectPage());

  const cardSlice = cards.slice(0, 50*page);
  return (
    <MedStandardPageContainer>
      <CardViewer>
        <div>
          <Inputs />
        </div>
        <CardTable cards={cardSlice} />
      </CardViewer>
    </MedStandardPageContainer>
  );
};

export default () => {
  const { path } = useRouteMatch();

  return (
    <CourseProvider>
      <Switch>
        <Route path={`${path}/config`}>
          <CourseConfig />
        </Route>
        <Route>
          <Course />
        </Route>
      </Switch>
    </CourseProvider>
  );
}

/**
<Route path="/course/:courseId/settings">
  <CourseConfig />
</Route>
*/

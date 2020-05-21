import React, { useEffect } from 'react';
import CardList from './CardList';
import { useSelector, useDispatch } from 'react-redux';
import { getCards, selectCards } from 'data/cardsSlice';
import { useUser } from 'app/UserContext';
import apiFetch from 'util/apiFetch';

export default () => {
  const cards = useSelector(selectCards);
  const dispatch = useDispatch();
  const user = useUser();

  console.log('user:', user);


  useEffect(() => {
    if (cards && cards[0]) {
      const cardId = cards[0]._id;
      apiFetch(`/api/card/${cardId}/update`, { prop: 'hey' })
        .then(res => console.log('res:', res));
    }
  }, [cards]);

  useEffect(() => {
    dispatch(getCards());
  }, []);

  if (!cards || !Object.values(cards).length){
    return <div>Wait. Be patient.</div>;
  }

  return <CardList cards={cards} />
};
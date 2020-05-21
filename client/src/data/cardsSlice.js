import { createSlice } from '@reduxjs/toolkit';
import apiRoutes from 'app/apiRoutes';
import apiFetch from 'util/apiFetch';

export const cardsSlice = createSlice({
  name: 'cards',
  initialState: {},
  reducers: {
    setCards: (state, action) => action.payload,
  },
});

export const { setCards } = cardsSlice.actions;

export const getCards = () => dispatch => {
  apiFetch(apiRoutes.cards())
    .then(cards => dispatch(setCards(cards)));
};

export const selectCards = state => state.cards;
export const selectCard = id => state => state.cards[id];

export default cardsSlice.reducer;

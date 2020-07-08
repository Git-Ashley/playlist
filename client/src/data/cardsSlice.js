import { createSlice } from '@reduxjs/toolkit';
import apiRoutes from 'app/apiRoutes';
import apiFetch from 'util/apiFetch';

export const cardsSlice = createSlice({
  name: 'cards',
  initialState: {},
  reducers: {
    setCards: (state, action) => action.payload,
    setCard: (state, action) => {
      const updatedCard = action.payload;
      state[updatedCard.id] = updatedCard;
    },
    setMems: (state, action) => {
      const { updatedMems, cardId } = action.payload;
      const card = state[cardId];

      if (card) {
        card.mems = updatedMems;
      }
    },
  },
});

const sliceActions = cardsSlice.actions;

export const getCards = () => async (dispatch) => {
  const cards = await apiFetch(apiRoutes.cardsSearch(), { excludeUserTags: ['ignore'] }, { method: 'POST' });

  const cardsOrder = cards.map(card => card.id);
  const cardsMap = cards.reduce((accum, card) => {
    accum[card.id] = card;
    return accum;
  }, {});

  dispatch(sliceActions.setCards(cardsMap));

  return cardsOrder;
};

export const updateCard = (cardId, updates) => dispatch => {
  return apiFetch(`/api/card/${cardId}/update`, updates)
    .then(card => {
      console.log(card);
      return dispatch(sliceActions.setCard(card));
    })
    .catch(console.log);
};

//TODO export const updateBlueprint

export const ignoreCard = cardId => (dispatch, getState) => {
  const state = getState();
  const currentCard = selectCard(cardId)(state);
  if (currentCard.tags.includes('ignore')) {
    return;
  }
  const updatedTags = [...currentCard.tags, 'ignore'];
  dispatch(updateCard(cardId, { tags: updatedTags }));
};

export const reviewCard = (cardId, level) => dispatch => {
  apiFetch(apiRoutes.reviewCard(cardId), { level })
    .then(console.log);
};

export const addMem = (text, cardId) => dispatch => {
  console.log('adding mem:', text);
  apiFetch(apiRoutes.addMem(), { text, cardId })
    .then(updatedMems => {
      dispatch(sliceActions.setMems({ updatedMems, cardId }));
    });
};

export const deleteMem = (id, cardId) => dispatch => {
  console.log('removing mem:', id);
  apiFetch(apiRoutes.deleteMem(), { memId: id, cardId })
    .then(updatedMems => {
      dispatch(sliceActions.setMems({ updatedMems, cardId }));
    });
};

export const selectCards = ids => ({ cards }) =>
  Object
    .entries(cards)
    .filter(([key]) => ids.includes(key))
    .map(([key, value]) => value);

export const selectCard = id => state => state.cards[id];

export default cardsSlice.reducer;
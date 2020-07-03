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
      const index = state.findIndex(card => card.id === updatedCard.id);

      if (index !== -1) {
        state[index] = updatedCard;
      }
    },
    updateCard: (state, action) => {
      const { updates, id } = action.payload;
      const index = state.findIndex(card => card.id === id);

      if (index !== -1) {
        state[index] = { ...state[index], ...updates };
      }
    },
    setMems: (state, action) => {
      const { updatedMems, cardId } = action.payload;
      const card = state.find(card => card.id === cardId);
      console.log('card', card);

      card.mems = updatedMems;
    },
  },
});

const sliceActions = cardsSlice.actions;
//export const { } = cardsSlice.actions;

export const getCards = () => dispatch => {
  apiFetch(apiRoutes.cardsSearch(), { excludeUserTags: 'ignore' }, { method: 'GET' })
    .then(cards => dispatch(sliceActions.setCards(cards)));
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

/*export const selectMem = (memId) => dispatch => {
  apiFetch()
    .then()
};*/

export const selectCards = state => state.cards;
export const selectCard = id => state => state.cards.find(card => card.id === id);

export default cardsSlice.reducer;


/** TODO
 * Probbaly have a selector which allows passing in a searchOrder array. Where does searchOrder come from?
 * Here? Some UI reducer? Find out... after the break.
 */
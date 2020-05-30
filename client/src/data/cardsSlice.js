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
    setMems: (state, action) => {
      const { updatedMems, cardId } = action.payload;
      const card = state.find(card => card.id === cardId);
      console.log('card', card);

      card.mems = updatedMems;
    },
  },
});

export const { setCards, setMems } = cardsSlice.actions;

export const getCards = () => dispatch => {
  apiFetch(apiRoutes.cards())
    .then(cards => dispatch(setCards(cards)));
};

export const reviewCard = (cardId, level) => dispatch => {
  apiFetch(apiRoutes.reviewCard(cardId), { level })
    .then(console.log);
};

export const addMem = (text, cardId) => dispatch => {
  console.log('adding mem:', text);
  apiFetch(apiRoutes.addMem(), { text, cardId })
    .then(updatedMems => {
      dispatch(setMems({ updatedMems, cardId }));
    });
};

export const deleteMem = (id, cardId) => dispatch => {
  console.log('removing mem:', id);
  apiFetch(apiRoutes.deleteMem(), { memId: id, cardId })
    .then(updatedMems => {
      dispatch(setMems({ updatedMems, cardId }));
    });
};

/*export const selectMem = (memId) => dispatch => {
  apiFetch()
    .then()
};*/

export const selectCards = state => state.cards;
export const selectCard = id => state => state.cards[id];

export default cardsSlice.reducer;


/** TODO
 * Probbaly have a selector which allows passing in a searchOrder array. Where does searchOrder come from?
 * Here? Some UI reducer? Find out... after the break.
 */
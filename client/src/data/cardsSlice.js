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
      state[updatedCard._id] = updatedCard;
    },
    updateCard: (state, action) => {
      const cardId = action.payload._id;
      const updateFields = action.payload;
      const updatedCard = {
        ...state[cardId],
        ...updateFields,
      };
      state[cardId] = updatedCard;
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

export const getCards = searchParams => async (dispatch) => {
  console.log('searchParams', searchParams)
  const { data, count } = await apiFetch(apiRoutes.cardsSearch(), searchParams, { method: 'POST' });

  const cardsOrder = data.map(card => card._id);
  const cardsMap = data.reduce((accum, card) => {
    accum[card._id] = card;
    return accum;
  }, {});

  dispatch(sliceActions.setCards(cardsMap));

  return { searchOrder: cardsOrder, count };
};

export const updateCard = (cardId, updates) => dispatch => {
  return apiFetch(apiRoutes.updateCard(cardId), updates)
    .then(card => {
      console.log(card);
      return dispatch(sliceActions.setCard(card));
    })
    .catch(console.log);
};

export const updateBlueprint = (cardId, updates) => dispatch => {
  return apiFetch(apiRoutes.updateBlueprint(cardId), updates)
    .then(card => {
      return dispatch(sliceActions.setCard(card));
    })
    .catch(console.log);
};

export const addTagToBlueprint = (cardId, tag) => (dispatch, getState) => {
  const state = getState();
  const currentCard = selectCard(cardId)(state);
  if (currentCard.course_tags.includes(tag)) {
    return;
  }
  const updatedTags = [...currentCard.course_tags, tag];
  dispatch(updateBlueprint(cardId, { course_tags: updatedTags }));
};

export const removeTagFromBlueprint = (cardId, tag) => (dispatch, getState) => {
  const state = getState();
  const currentCard = selectCard(cardId)(state);
  if (!currentCard.course_tags.includes(tag)) {
    return;
  }
  const updatedTags = currentCard.course_tags.filter(val => val !== tag);
  dispatch(updateBlueprint(cardId, { course_tags: updatedTags }));
};

export const addTag = (cardId, tag) => (dispatch, getState) => {
  const state = getState();
  const currentCard = selectCard(cardId)(state);
  const cardTags = currentCard.tags || [];
  if (cardTags.includes(tag)) {
    return;
  }
  const updatedTags = [...cardTags, tag];
  dispatch(updateCard(cardId, { tags: updatedTags }));
};

export const removeTag = (cardId, tag) => (dispatch, getState) => {
  const state = getState();
  const currentCard = selectCard(cardId)(state);
  if (!currentCard.tags.includes(tag)) {
    return;
  }

  const updatedTags = currentCard.tags.filter(val => val !== tag);
  dispatch(updateCard(cardId, { tags: updatedTags }));
};

export const ignoreCard = cardId => dispatch => {
  dispatch(addTag(cardId, 'ignore'));
};

export const reviewCard = (cardId, level) => dispatch => {
  apiFetch(apiRoutes.reviewCard(cardId), { level })
    .then(card => {
      return dispatch(sliceActions.setCard(card));
    })
    .catch(console.log);
};

export const createCard = data => dispatch => {
  return apiFetch(apiRoutes.createCard(), data);
};

export const addMem = (data, cardId, img = false) => dispatch => {
  const payload = { cardId };
  if (img) {
    payload.imgData = data;
  } else {
    payload.text = data;
  }

  apiFetch(apiRoutes.addMem(), payload)
    .then(updatedMems => {
      dispatch(sliceActions.setMems({ updatedMems, cardId }));
    });
};

export const deleteMem = (id, cardId) => dispatch => {
  apiFetch(apiRoutes.deleteMem(), { memId: id, cardId })
    .then(updatedMems => {
      dispatch(sliceActions.setMems({ updatedMems, cardId }));
    });
};

export const unlearnCard = cardId => dispatch => {
  apiFetch(apiRoutes.unlearnCard(cardId), {})
    .then(updatedFields => {
      dispatch(sliceActions.updateCard({
        ...updatedFields,
        level: null,
        review_date: null,
        _id: cardId,
      }));
    });
};

export const selectCards = ids => ({ cards }) =>
  Object
    .entries(cards)
    .filter(([key]) => ids.includes(key))
    .map(([key, value]) => value);

export const selectCard = id => state => state.cards[id];

export default cardsSlice.reducer;

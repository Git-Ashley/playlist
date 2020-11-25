import { configureStore } from '@reduxjs/toolkit';

import cardsReducer from 'data/cardsSlice';
import cardTableReducer from 'features/cardTable/cardTableSlice';

export default configureStore({
  reducer: {
    cards: cardsReducer,
    cardTable: cardTableReducer,
  },
});

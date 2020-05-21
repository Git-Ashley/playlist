import { configureStore } from '@reduxjs/toolkit';

import cardsReducer from 'data/cardsSlice';

export default configureStore({
  reducer: {
    cards: cardsReducer,
  },
});

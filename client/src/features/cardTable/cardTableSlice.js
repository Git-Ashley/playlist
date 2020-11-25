import { createSlice } from '@reduxjs/toolkit';
import apiRoutes from 'app/apiRoutes';
import apiFetch from 'util/apiFetch';
import { getCards, selectCards } from "data/cardsSlice";

const reducerName = 'cardTable';
export const cardTableSlice = createSlice({
  name: reducerName,
  initialState: {
    searchOrder: [],
    count: 0,
    page: 1,
  },
  reducers: {
    setSearchOrder: (state, action) => {
      state.searchOrder = action.payload;
    },
    setCount: (state, action) => {
      state.count = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
});

const sliceActions = cardTableSlice.actions;

export const searchCards = searchParams => async (dispatch) => {
  const { searchOrder, count } = await dispatch(getCards(searchParams));
  dispatch(sliceActions.setSearchOrder(searchOrder));
  dispatch(sliceActions.setCount(count));
};

export const setPage = page => async (dispatch) => {
  dispatch(sliceActions.setPage(page));
}

// Selectors
export const selectSearchOrder = () => state => state.cardTable.searchOrder;
export const selectCount = () => state => state.cardTable.count;
export const selectPage = () => state => state.cardTable.page;

export default cardTableSlice.reducer;

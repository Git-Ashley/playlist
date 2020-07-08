const apiPrefix = '/api';


const apiRoutes = {
  cards: () => '/cards',
  cardsSearch: () => '/cards/search',
  login: () => '/login',
  updateCard: cardId => `/card/${cardId}/update`,
  reviewCard: cardId => `/card/${cardId}/review`,
  mems: () => '/mems',
  addMem: () => '/mem/add',
  deleteMem: () => `/mem/delete`,
};

const derivedApiRoutes = Object.entries(apiRoutes).reduce((accum, [key, fn]) => {
  accum[key] = (...args) => {
    const route = fn(...args);
    return `${apiPrefix}${route}`;
  };
  return accum;
}, {});

export default derivedApiRoutes
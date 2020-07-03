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

let derivedApiRoutes = {};

Object.entries(apiRoutes).map(([key, fn]) => {
  derivedApiRoutes[key] = (...args) => {
    const route = fn(...args);
    return `${apiPrefix}${route}`;
  }
});

export default derivedApiRoutes
const apiPrefix = '/api';


const apiRoutes = {
  cards: () => '/cards',
  cardsSearch: () => '/cards/search',
  login: () => '/auth/local',
  updateCard: cardId => `/card/${cardId}/update`,
  reviewCard: cardId => `/card/${cardId}/review`,
  updateBlueprint: cardId => `/card/${cardId}/blueprint`,
  mems: () => '/mems',
  addMem: () => '/mem/add',
  deleteMem: () => '/mem/delete',
  course: (courseId) => `/course/${courseId}`,
  changePassword: () => '/user/password/',
  addUserTag: (courseId) => `/course/${courseId}/tag/add`,
};

const derivedApiRoutes = Object.entries(apiRoutes).reduce((accum, [key, fn]) => {
  accum[key] = (...args) => {
    const route = fn(...args);
    return `${apiPrefix}${route}`;
  };
  return accum;
}, {});

export default derivedApiRoutes
const apiPrefix = '/api';


const apiRoutes = {
  setPassword: () => '/user/setpasswd',

  localLogin: () => '/auth/local',
  relogin: () => '/auth/login',

  cards: () => '/cards',
  cardsSearch: () => '/cards/search',
  updateCard: cardId => `/card/${cardId}/update`,
  reviewCard: cardId => `/card/${cardId}/review`,
  updateBlueprint: cardId => `/card/${cardId}/blueprint`,

  mems: () => '/mems',
  addMem: () => '/mem/add',
  deleteMem: () => '/mem/delete',

  course: (courseId) => `/course/${courseId}`,
  createUserTag: (courseId) => `/course/${courseId}/tag/create`,
  createCourseTag: (courseId) => `/course/${courseId}/course-tag/create`,
};

const derivedApiRoutes = Object.entries(apiRoutes).reduce((accum, [key, fn]) => {
  accum[key] = (...args) => {
    const route = fn(...args);
    return `${apiPrefix}${route}`;
  };
  return accum;
}, {});

export default derivedApiRoutes

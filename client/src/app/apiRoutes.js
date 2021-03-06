const apiPrefix = '/api';


const apiRoutes = {
  setPassword: () => '/user/setpasswd',

  localLogin: () => '/auth/local',
  guestLogin: () => '/user/guestlogin',
  relogin: () => '/auth/login',
  logout: () => '/auth/logout',

  cards: () => '/cards',
  mems: () => '/mems',
  courses: () => '/courses',

  cardsSearch: () => '/cards/search',
  createCard: data => '/card/create',
  updateCard: cardId => `/card/${cardId}/update`,
  reviewCard: cardId => `/card/${cardId}/review`,
  unlearnCard: cardId => `/card/${cardId}/unlearn`,
  updateBlueprint: cardId => `/card/${cardId}/blueprint`,

  addMem: () => '/mem/add',
  deleteMem: () => '/mem/delete',

  course: (courseId) => `/course/${courseId}`,
  createCourse: () => '/course/create',
  createUserTag: (courseId) => `/course/${courseId}/tag/create`,
  createCourseTag: (courseId) => `/course/${courseId}/course-tag/create`,

  getKanjiStats: (kanji) => `/stats/kanji/${kanji}`,
};

const derivedApiRoutes = Object.entries(apiRoutes).reduce((accum, [key, fn]) => {
  accum[key] = (...args) => {
    const route = fn(...args);
    return `${apiPrefix}${route}`;
  };
  return accum;
}, {});

export default derivedApiRoutes

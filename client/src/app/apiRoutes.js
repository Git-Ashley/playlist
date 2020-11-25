const apiPrefix = '/api';


const apiRoutes = {
  setPassword: () => '/user/setpasswd',

  localLogin: () => '/auth/local',
  guestLogin: () => '/user/guestlogin',
  relogin: () => '/auth/login',
  logout: () => '/auth/logout',

  cards: () => '/cards',
  cardsSearch: () => '/cards/search',
  createCard: data => '/card/create',
  updateCard: cardId => `/card/${cardId}/update`,
  reviewCard: cardId => `/card/${cardId}/review`,
  unlearnCard: cardId => `/card/${cardId}/unlearn`,
  updateBlueprint: cardId => `/card/${cardId}/blueprint`,

  mems: () => '/mems',
  addMem: () => '/mem/add',
  deleteMem: () => '/mem/delete',

  courses: () => '/courses',
  course: (courseId) => `/course/${courseId}`,
  createCourse: () => '/course/create',
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

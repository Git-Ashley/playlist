const apiPrefix = '/api';


const apiRoutes = {
  cards: () => '/cards',
  login: () => '/login',
};

let derivedApiRoutes = {};

Object.entries(apiRoutes).map(([key, fn]) => {
  derivedApiRoutes[key] = (...args) => {
    const route = fn(...args);
    return `${apiPrefix}${route}`;
  }
});

export default derivedApiRoutes
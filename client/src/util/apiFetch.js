export default (url, payload, ops = {}) => {

  const fetchOps = {
    method: ops.method || (payload ? 'POST' : 'GET'),
    headers: {
      'Content-Type': 'application/json'
    },
  };

  if (payload && ['PUT', 'POST'].includes(fetchOps.method)) {
    fetchOps.body = JSON.stringify(payload);
  }

  const fetchOptions = Object.assign({}, ops, fetchOps);

  return fetch(url, fetchOptions)
    .then(res => res.json())
    .catch(console.log)
};
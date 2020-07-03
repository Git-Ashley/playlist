export default (path, payload, ops = {}) => {

  let url = path;

  const fetchOps = {
    method: ops.method || (payload ? 'POST' : 'GET'),
    headers: {
      'Content-Type': 'application/json'
    },
  };

  if (payload && ['PUT', 'POST'].includes(fetchOps.method)) {
    fetchOps.body = JSON.stringify(payload);
  }

  if (payload && fetchOps.method === 'GET') {
    url += '?';
    url += Object.entries(payload).map(arr => arr.join('=')).join('&');
  }

  const fetchOptions = Object.assign({}, ops, fetchOps);

  return fetch(url, fetchOptions)
    .then(res => res.json())
    .catch(console.log)
};
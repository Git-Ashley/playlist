export default (path, payload, ops = {}) => {

  let url = path;

  const fetchOps = {
    method: ops.method || (payload ? 'POST' : 'GET'),
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
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
    .then(res => {
      if (res.status >= 400 && res.status < 600) {
        return res.json().then(json => {throw json;});
      }

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return res.json();
      } else {
        return res.text();
      }
    })
};

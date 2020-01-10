import React, { useEffect, useState } from 'react';

/** TODO
 * 1. API HOOK
 * 2. MUSIC PROJ
 * 3. DEPLYOMENT AND BACKUPS/DISASTER RECOVERY
 */

const fetchClosure = (url, { method = 'POST', ...otherOps } = {}, setData, setLoading) => data => {
  setLoading(true);

  const ops = { method };

  if (method !== 'GET' && method !== 'DELETE') {
    ops.headers = {
      'Content-Type': 'application/json'
    };
    ops.body = JSON.stringify(data);
  }

  const fetchOptions = Object.assign({}, ops, otherOps);

  return fetch(url, fetchOptions)
    .then(res => res.json())
    .then(setData)
    .catch(console.log)
    .finally(() => setLoading(false))
};

const useFetch = (url, ops) => {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const fetchData = fetchClosure(url, ops, setData, setLoading);

  return [fetchData, data, isLoading];
}

function App() {
  const [fetchData, data, isLoading] = useFetch('/api/test')
  const [txt, setTxt] = useState('Hello')

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <input type="text" onChange={e => setTxt(e.target.value)} />
      <button type="button" onClick={() => fetchData({ value: txt })}>lol</button>
      <div className="App">
        <div>{JSON.stringify(data)}</div>
      </div>
      {isLoading && <div>LOADING!!!</div>}
    </>
  );
}

export default App;

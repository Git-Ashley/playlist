import { useState, useCallback } from "react";

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
};

export default useFetch;
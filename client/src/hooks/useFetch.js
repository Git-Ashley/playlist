import { useState } from "react";
import apiFetch from 'util/apiFetch';

const fetchClosure = (url, ops, setData, setLoading) => payload => {
  setLoading(true);

  return apiFetch(url, payload, ops)
    .then(setData)
    .catch(console.log)
    .then(() => setLoading(false))
};

const useFetch = (url, ops) => {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const fetchData = fetchClosure(url, ops, setData, setLoading);

  return [fetchData, data, isLoading];
};

export default useFetch;
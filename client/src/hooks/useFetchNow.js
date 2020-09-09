import { useState, useEffect } from "react";
import apiFetch from 'util/apiFetch';

export default (url, payload, capture = [], ops) => {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    apiFetch(url, payload, ops)
      .then(setData)
      .catch(console.log)
      .then(() => setLoading(false))
  }, capture);

  return [data, isLoading];
};

import React, { useCallback, useState } from 'react';
import apiFetch from "util/apiFetch";
import apiRoutes from "app/apiRoutes";

export default ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('rooster356');
  const [password, setPassword] = useState('libor');
  const [errors, setErrors] = useState(null);

  const login = useCallback(() => {
    apiFetch(apiRoutes.localLogin(), {
      username, password
    }).then(user => {
      if (user._id) {
        onLoginSuccess(user);
      } else {
        console.log('error:', user);
      }
    }).catch(setErrors);
  }, [username, password]);

  return (<div>
    <input
      placeholder='username'
      type='text'
      onChange={e => setUsername(e.target.value)}
      value={username}
    />
    <input
      placeholder='password'
      type='text'
      onChange={e => setPassword(e.target.value)}
      value={password}
    />
    <button onClick={login}>login</button>
  </div>);
}

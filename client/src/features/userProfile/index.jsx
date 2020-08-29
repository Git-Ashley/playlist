import React, { useState, useCallback } from 'react';
import { useUser } from 'app/UserContext';
import styled from 'styled-components';
import { NarrowStandardPageContainer } from 'components/layouts/pageContainers';
import apiRoutes from 'app/apiRoutes';
import apiFetch from 'util/apiFetch';

export default () => {
  const [user, setUser] = useUser();
  const [newPassword, setNewPassword] = useState('');
  const handleConfirmNewPassword = useCallback(() => {
    apiFetch(apiRoutes.setPassword(), { newPassword })
      .then(console.log);
  }, [newPassword]);

  return <NarrowStandardPageContainer>
    <div>User profile: {JSON.stringify(user)}</div>
    <div>
      <label>New password:</label>
      <input
        type="text"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
      />
      <button onClick={handleConfirmNewPassword}>Confirm</button>
    </div>
  </NarrowStandardPageContainer>;
}

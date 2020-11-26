import React, { useState, useCallback } from 'react';
import apiFetch from "util/apiFetch";
import apiRoutes from "app/apiRoutes";
import styled from 'styled-components';
import Button from 'components/atoms/buttons/Button';
import { Std as Text } from 'styles/Text';
import { CardOutline } from 'styles/Cards';

const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  & > * {
    margin: 20px;
  }
`;

const Summary = styled(CardOutline)`
  padding: 20px;
  max-width: 300px;
  & > :not(:first-child) {
    margin-top: 10px;
  }
  box-shadow: unset;
`;

export default ({ onLoginSuccess }) => {
  const [errors, setErrors] = useState([]);

  const login = useCallback(() => {
    apiFetch(apiRoutes.guestLogin(), {})
      .then(user => {
        if (user._id) {
          onLoginSuccess(user);
        } else {
          console.log('error:', user);
        }
      }).catch(setErrors);
  }, []);

  return (<LoginContainer>
    <Summary>
      <Text>The app is currently in Guest Mode and regular user creation & login is disabled.</Text>
      <Text>Logging in as a guest will create a temporary account with some cards in the <b>Kanji 2500</b> course randomly assigned to Review.</Text>
      <Text>You may leave the site and log back into the same guest provided you do not clear your cookies or logout.</Text>
    </Summary>
    <Button onClick={login}>Guest Login</Button>
  </LoginContainer>);
}

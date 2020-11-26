import React, { useContext, useCallback } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { useUser } from "app/UserContext";
import { comfortTheme, defaultTheme } from 'app/theme';
import { Link, useHistory } from 'react-router-dom';
import { BsPersonFill, BsFillCaretDownFill } from 'react-icons/bs';
import { NarrowStandardPageContainer } from 'components/layouts/pageContainers';
import Dropdown, { NestedDropdown } from 'components/molecules/Dropdown';
import Select from 'components/molecules/Select';
import { RiHome2Fill as HomeIcon } from 'react-icons/ri';
import apiRoutes from 'app/apiRoutes';
import apiFetch from 'util/apiFetch';

const Personalisation = styled.div`
  display: flex;
  align-items: center;

  > :nth-child(1) {

  }

  > :nth-child(2) {
    margin-left: 20px;
  }

  > :nth-child(3) {
    margin-left: 8px;
  }

  ${props => props.disabled ? 'opacity: 50%; cursor: not-allowed;' : ''}
`;

const AppHeader = styled.div`
  height: ${props => props.theme.headerHeight}px;
  background-color: ${props => props.theme.mainHeader};
`;

const AppHeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px;
  height: 100%;
`;

const UserIconContainer = styled(BsPersonFill)`
  background: ${props => props.theme.mainHeaderText};
  color: ${props => props.theme.mainHeader};
  border-radius: 50px;
  padding: 4px;
`;

const DisabledUserIcon = styled(UserIconContainer)`
  opacity: 50%;
  cursor: not-allowed;
`;

export default ({ setTheme }) => {
  const themeContext = useContext(ThemeContext);
  const history = useHistory();
  const [user, setUser] = useUser();

  const logoutHandler = useCallback(() => {
    apiFetch(apiRoutes.logout(), {})
      .then(() => {
        setUser(null);
      })
      .catch(console.log);
  }, []);

  return (
    <AppHeader>
      <NarrowStandardPageContainer>
        <AppHeaderContent>
          <Link to="/"><HomeIcon color={themeContext.secondaryText} size={48} /></Link>
          <Personalisation>
            { user &&
              <Dropdown
                label={<UserIconContainer size={40} />}
                color={themeContext.mainHeaderText}
                overlayPosition={{ top: 30, right: 5 }}
                width={85}
                overlayWidth={100}
              >
                <div onClick={() => history.push("/user/profile")}>User</div>
                <NestedDropdown
                  persistOverlay
                  label="Theme"
                >
                  <div onClick={() => setTheme(defaultTheme)}>Default</div>
                  <div onClick={() => setTheme(comfortTheme)}>Experimental</div>
                </NestedDropdown>
                <div onClick={logoutHandler}>Logout</div>
              </Dropdown>
            }
            { !user && <DisabledUserIcon size={40} /> }
          </Personalisation>
        </AppHeaderContent>
      </NarrowStandardPageContainer>
    </AppHeader>
  );
}

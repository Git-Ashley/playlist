import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { comfortTheme, defaultTheme } from 'app/theme';
import { Link } from 'react-router-dom';
import { BsPersonFill, BsFillCaretDownFill } from 'react-icons/bs';
import { NarrowStandardPageContainer } from 'components/layouts/pageContainers';
import Dropdown from 'components/molecules/Dropdown';

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

export default ({ setTheme }) => {
  const themeContext = useContext(ThemeContext);

  return (
    <AppHeader>
      <NarrowStandardPageContainer>
        <AppHeaderContent>
          <div>
            <Link to="/">Home</Link>
            <Link to="/user/profile">User</Link>
          </div>
          <Personalisation>
            <Dropdown
              label="theme"
              options={[
                { label: "Default", value: defaultTheme },
                { label: "Comfort", value: comfortTheme },
              ]}
              onSelect={setTheme}
            />
            <BsFillCaretDownFill color={themeContext.mainHeaderText} />
            <UserIconContainer size={40} />
          </Personalisation>
        </AppHeaderContent>
      </NarrowStandardPageContainer>
    </AppHeader>
  );
}

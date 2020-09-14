import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { comfortTheme, defaultTheme } from 'app/theme';
import { Link } from 'react-router-dom';
import { BsPersonFill, BsFillCaretDownFill } from 'react-icons/bs';
import { NarrowStandardPageContainer } from 'components/layouts/pageContainers';
import Dropdown, { NestedDropdown } from 'components/molecules/Dropdown';
import Select from 'components/molecules/Select';

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
            <Select
              options={[
                { label: "Default", value: defaultTheme },
                { label: "Comfort", value: comfortTheme },
              ]}
              onSelect={setTheme}
              value={themeContext}
            />
            <Dropdown
              label={<UserIconContainer size={40} />}
              color={themeContext.mainHeaderText}
              overlayPosition={{ top: 30, right: 5 }}
              width={85}
              overlayWidth={100}
            >
              <div onClick={() => console.log('logout!')}>Logout</div>
              <NestedDropdown
                persistOverlay
                label="Theme"
              >
                <div onClick={() => console.log('some theme thing')}>NESTED OPTION 1</div>
                <div onClick={() => console.log('logout!')}>NESTED OPTION 2</div>
              </NestedDropdown>
            </Dropdown>
          </Personalisation>
        </AppHeaderContent>
      </NarrowStandardPageContainer>
    </AppHeader>
  );
}

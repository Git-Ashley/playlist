import styled from 'styled-components';

export const CardOutline = styled.div`
  box-shadow: 0 50px 100px rgba(50,50,93,.1), 0 15px 35px rgba(50,50,93,.15), 0 5px 15px rgba(0,0,0,.1);
  background-color: ${props => props.ignored ? '#e4955b' : props.theme.primary};
  border-radius: 5px;
`;

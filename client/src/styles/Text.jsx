import styled from 'styled-components';

export const Std = styled.div`
  ${({ center }) => center ? 'text-align: center;' : ''}
  ${({ bold }) => bold ? 'font-weight: bold;' : ''}
  color: rgba(0,0,0,0.7);
`;

export const SubHeader = styled(Std)`
  font-size: 20px;
  font-weight: bold;
`;

export default { Std, SubHeader };

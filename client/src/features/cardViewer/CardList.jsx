import React from 'react';
import styled from 'styled-components';

const CardTable = styled.div`
  display: flex;
  flex-direction: column;
`;

const CardRow = styled.div`
  border-bottom: 1px solid black;
`;

export default ({ cards }) => (
  <CardTable>
    {cards.map(card => (
      <CardRow key={card._id}>
        {JSON.stringify(card)}
      </CardRow>
    ))}
  </CardTable>
);
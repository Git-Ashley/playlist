import React from 'react';
import styled from 'styled-components';
import Modal from './index';
import Button from 'components/atoms/buttons/Button';

const ButtonsContainer = styled.div`
  margin-top: 30px;
  display: flex;

  & > * {
    width: 75px;
  }

  & > :first-child {
    margin-right: 20px;
  }
`;

const ConfirmHeader = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
`;

export default ({
  children,
  onConfirm,
  header,
  onDecline = () => {},
  confirmLabel = 'Ok',
  declineLabel = 'Cancel',
  onClose = null, // Will use onDecline if null
  ...props
}) => (
  <Modal {...props} onClose={onClose || onDecline}>
    <ConfirmHeader>{header}</ConfirmHeader>
    {children}
    <ButtonsContainer>
      <Button onClick={onConfirm}>{confirmLabel}</Button>
      <Button onClick={onDecline}>{declineLabel}</Button>
    </ButtonsContainer>
  </Modal>
);

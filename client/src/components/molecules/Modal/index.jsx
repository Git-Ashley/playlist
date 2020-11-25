import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import DeleteOverlay from 'components/molecules/DeleteOverlay';

const ModalContainer = styled.div`
.App {
    text-align: center;
    padding-top: 2rem;
}

.modal-overlay {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1040;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0,0,0,0.5);
}

.modal {
    display: inline-block;
    background: white;
    position: relative;
    max-width: 90vw;
    border-radius: 3px;
    padding: 30px 30px 20px;
    overflow: auto;
}

.modal-header {
    display: flex;
    justify-content: flex-end;
}

.modal-close-button {
    font-size: 1.4rem;
    font-weight: 700;
    line-height: 1;
    color: #000;
    opacity: .3;
    cursor: pointer;
    border: none;
}

button {
    font-size: .9rem;
    font-weight: 700;
    border: none;
    border-radius: 3px;
    padding: .3rem 1rem;
    margin-left: .5rem;
}

.button-default {
    background: #247BA0;
    color: #fff;
}
`;

export default ({ children, show, onClose }) => show ? ReactDOM.createPortal(
  <ModalContainer>
    <div className="modal-overlay">
      <DeleteOverlay showActionOnHover={false} onAction={onClose}>
        <div className="modal">
          {children}
        </div>
      </DeleteOverlay>
    </div>
  </ModalContainer>, document.body
) : null;

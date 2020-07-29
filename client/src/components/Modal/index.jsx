import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';


const ModalContainer = styled.div`
.App {
    text-align: center;
    padding-top: 2rem;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1040;
    width: 100vw;
    height: 100vh;
    background-color: #000;
    opacity: .5;
}

.modal-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1050;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    outline: 0;
}

.modal {
    z-index: 100;
    background: white;
    position: relative;
    margin: 1.75rem auto;
    border-radius: 3px;
    max-width: 500px;
    padding: 2rem;
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
        <div className="modal-overlay"/>
        <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
            <div className="modal">
                <div className="modal-header">
                    <button type="button" className="modal-close-button" data-dismiss="modal" aria-label="Close" onClick={onClose}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    </ModalContainer>, document.body
) : null;
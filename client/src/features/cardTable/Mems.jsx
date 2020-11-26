/* eslint-disable-next-line react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback, useRef } from 'react';
import apiRoutes from 'app/apiRoutes';
import useFetch from 'hooks/useFetch';
import useToggle from 'hooks/useToggle';
import styled from 'styled-components';
import {useDispatch} from "react-redux";
import { BsChevronDown, BsPlus, BsFillInfoCircleFill, BsX } from 'react-icons/bs';
import ActionableDisplay from 'components/atoms/ActionableDisplay';
import { addMem, deleteMem } from 'data/cardsSlice';
import Modal from 'components/molecules/Modal';


//TODO Make them into large pills, encompaaing the mem. the selecgted_mem is coloured green. click one will make that
// the selected one. ('+') to add new ones.

const MemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 250px;
  padding: 10px 10px 0;
  overflow-y: auto;

  & > * {
    width: 100%;
  }

  & > :not(:last-child) {
    margin-bottom: 10px;
  }
`;

const StyledPill = styled.div`
  padding: 5px;
  border-radius: 10px;
  position: relative;
`;

const NewMemContainer = styled.div`
  position: absolute;
  transition: bottom 0.3s ease;
  bottom: ${props => props.show ? '0' : '-31px'};
  left: 0;
  right: 0;

  height: 31px;

  padding: 5px;
  display: flex;
  font-weight: bold;
  background: ${props => props.theme.secondary};

  & >:not(.new-mem-btn) {
    z-index: 3;
  }

  & > .new-mem-btn {
    z-index: 2;
  }

  & >:nth-child(2) {
    flex: 4;
  }

  & >:nth-child(3) {
    flex: 1;
    padding-left: 0;
    padding-right: 0;
  }

  & >:nth-child(4) {
    flex: 1;
    padding-left: 0;
    padding-right: 0;
  }
`;

const NewMemBtn = styled.div`
  margin: auto;
  position: absolute;
  bottom: 8px;
  left: calc(50% - 20px);
  height: 40px;
  width: 40px;
  cursor: pointer;

  text-align: center;
  border-radius: 50px;
  background: ${props => props.theme.secondary};
  color: ${props => props.theme.secondaryText};
`;

const MemageContainer = styled.img`
  max-width: 250px;
  cursor: pointer;
`;

const StyledBsChevronDown = styled(BsChevronDown)`
  margin-top: 3px;
`;

const Memage = ({ src }) => {
  const [isShowing, toggleIsShowing] = useToggle();

  return <>
    <Modal show={isShowing} onClose={toggleIsShowing}>
      <img src={src} />
    </Modal>
    <MemageContainer src={src} onClick={toggleIsShowing} />
  </>;
};

const NewMem = ({ cardId, initOpen = false, ...otherProps }) => {
  const [text, setText] = useState('');
  const [show, toggleShow] = useToggle(initOpen);
  const dispatch = useDispatch();
  const [imgFile, setImgFile] = useState(null);

  const handlePaste = useCallback(event => {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    console.log(JSON.stringify(items)); // will give you the mime types
    for (let index in items) {
      const item = items[index];
      if (item.kind === 'file') {
        const blob = item.getAsFile();
        const [type, ext] = blob.type.split('/');
        if (type !== 'image' || !['png', 'jpg', 'jpeg', 'webp'].includes(ext)) {
          continue;
        }
        const reader = new FileReader();
        reader.onload = e => {
          const data = e.target.result;
          setImgFile({ data, type: ext });
        }; // data url!
        reader.readAsDataURL(blob);
      }
    }
  }, []);

  const onSubmitNewMem = () => {
    if (imgFile) {
      dispatch(addMem(imgFile, cardId, true));
    } else {
      dispatch(addMem(text, cardId));
    }
    setText('');
    setImgFile(null);
  };

  return <NewMemContainer show={show} {...otherProps}>
    <NewMemBtn onClick={toggleShow} className="new-mem-btn">
      { show ? <StyledBsChevronDown size={16} /> : <BsPlus size={20} /> }
    </NewMemBtn>
    {imgFile ? (
      <Memage src={imgFile.data} />
    ) : (
      <input
        placeholder='Type or paste image'
        type='text'
        onPaste={handlePaste}
        value={text}
        onChange={e => setText(e.target.value)}
      />
    )}
    <button onClick={onSubmitNewMem}>✓</button>
    {imgFile ? (
      <button onClick={() => console.log('shell')}>🗛</button>
    ) : (
      <button disabled onClick={() => console.log('shell')}>🖼</button>
    )}
  </NewMemContainer>;
};

const StyledMem = styled(StyledPill)`
  background: ${props => props.isSelected ? '#86cc86' : props.theme.primary};

  & >:nth-child(1) {
    font-weight: bold;
  }

  & >:nth-child(2) {
    margin-top: 10px;
  }
`;

const DeleteSymbol = styled(BsX)`
  height: ${({ size = 25 }) => size}px;
  width: ${({ size = 25 }) => size}px;
  position: absolute;
  top: 2px;
  right: 3px;
  cursor: pointer;
`;

const NoMems = styled.div`
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;

  & > :first-child {
    margin-right: 10px;
  }
`;

const MemPill = ({ mem, isSelected = false, onDelete }) => (
<ActionableDisplay onAction={onDelete} ActionComponent={DeleteSymbol}>
  <StyledMem isSelected={isSelected}>
    <div>{mem.author}</div>
    {mem.text ? <div>{mem.text}</div> : ''}
    {mem.imgUrl ? <Memage src={mem.imgUrl} /> : ''}
  </StyledMem>
</ActionableDisplay>);


export default ({ card, ...otherProps }) => {
  const dispatch = useDispatch();
  const [fetchMems, mems, isFetchingMems] = useFetch(apiRoutes.mems());

  const deleteMemHandler = (id) => dispatch(deleteMem(id, card._id));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (card.mems && card.mems.length) {
      fetchMems(card.mems);
    }
  }, [card]);

  if (isFetchingMems) {
    return <div {...otherProps}>Fetching mems...</div>;
  }

  return <div {...otherProps}>
    <MemsContainer>
      {mems && mems.length ? (
        mems.map(mem =>
          <MemPill
            key={mem.id}
            mem={mem}
            onDelete={() => deleteMemHandler(mem.id)}
            isSelected={card.selected_mem === mem.id}
          />
        )
      ) : (
        <NoMems>
          <BsFillInfoCircleFill size={20} />
          <div>No mems</div>
        </NoMems>
      )}
    </MemsContainer>
    <NewMem initOpen={!mems || !mems.length} cardId={card._id} />
  </div>;
}

/* eslint-disable-next-line react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback, useRef } from 'react';
import apiRoutes from 'app/apiRoutes';
import useFetch from 'hooks/useFetch';
import styled from 'styled-components';
import {useDispatch} from "react-redux";
import { addMem, deleteMem } from 'data/cardsSlice';


//TODO Make them into large pills, encompaaing the mem. the selecgted_mem is coloured green. click one will make that
// the selected one. ('+') to add new ones.

const MemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  
  & > * {
    width: 100%;
  }
  
  & > :not(:last-child) {
    margin-bottom: 10px;
  }
`;

const StyledPill = styled.div`
  cursor: pointer;
  padding: 5px;
  border: 1px solid black;
  border-radius: 10px;
  position: relative;
`;

const NewMemContainer = styled.div`
  padding: 5px;
  border: 1px solid black;
  border-radius: 10px;
  display: flex;
  font-weight: bold;
  background: #c7c7c7;
  
  & >:nth-child(1) {
    flex: 4;
  }
  
  & >:nth-child(2) {
    flex: 1;
  }
  
  & >:nth-child(3) {
    flex: 1;
  }
`;

const NewMem = ({ cardId }) => {
  const [text, setText] = useState('');
  const dispatch = useDispatch();
  const [imgFile, setImgFile] = useState(null);

  const handlePaste = useCallback(event => {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    console.log(JSON.stringify(items)); // will give you the mime types
    for (let index in items) {
      const item = items[index];
      if (item.kind === 'file') {
        const blob = item.getAsFile();
        const reader = new FileReader();
        reader.onload = e => {
          const bytes = e.target.result;
          setImgFile(bytes);
        }; // data url!
        reader.readAsDataURL(blob);
      }
    }
  }, []);

  const onSubmitNewMem = () => {
    dispatch(addMem(text, cardId));
    setText('');
  };

  return <NewMemContainer>
    {imgFile ? (
      <img src={imgFile} />
    ) : (
      <input
        placeholder='New mem'
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
      <button onClick={() => console.log('shell')}>🖼</button>
    )}
  </NewMemContainer>;
};

const StyledMem = styled(StyledPill)`
  background: ${props => props.isSelected ? '#86cc86' : 'inherit'};
  
  & >:nth-child(1) {
    font-weight: bold;
  }
   
  & >:nth-child(2) {
    margin-top: 10px;
  }
`;

const DeleteSymbol = styled.span`
  border: 1px solid black;
  border-radius: 5px;
  &:before {
    content: '×';
  }
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
`;

const MemPill = ({ mem, isSelected = false, onDelete }) => <StyledMem isSelected={isSelected}>
  <div>
    {mem.author}
  </div>
  <div>
    {mem.text}
  </div>
  <DeleteSymbol onClick={onDelete} />
</StyledMem>;


export default ({ card }) => {
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
    return <div>Fetching mems...</div>;
  }

  if (!mems || !mems.length) {
    return <NewMem cardId={card._id} />;
  }
  return <MemsContainer>
    {mems.map(mem =>
      <MemPill
        key={mem.id}
        mem={mem}
        onDelete={() => deleteMemHandler(mem.id)}
        isSelected={card.selected_mem === mem.id}
      />
    )}
    <NewMem cardId={card._id} />
  </MemsContainer>;
}
import React, { useEffect, useState, useCallback } from 'react';
import useFetch from 'hooks/useFetch'

function App() {
  const [getItemsRequest, items, getItemsLoading] = useFetch('/api/items');

  const [newItem, setNewItem] = useState('Hello');
  const [createItemRequest, item, createItemLoading] = useFetch('/api/item/add', { method: 'POST' });

  useEffect(() => {
    getItemsRequest();
  }, []);

  return (
    <>
      <button type="button" onClick={() => getItemsRequest()}>lol</button>
      {!getItemsLoading &&
        <div className="App">
          <b>Items:</b>
          <div>{JSON.stringify(items)}</div>
        </div>
      }
      {getItemsLoading && <div>GETTING ITEMS...</div>}
      <br />
      <input type="text" onChange={e => setNewItem(e.target.value)} />
      <button type="button" onClick={() => createItemRequest({ name: newItem, value: new Date() })}>Create item</button>
      {createItemLoading && <div>CREATING ITEM...</div>}
      {item && !createItemLoading && <div>
        Created {JSON.stringify(item)}!
      </div>}
    </>
  );
}

export default App;
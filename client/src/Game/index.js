import React, { useCallback, useEffect, useRef, useState } from 'react';
import content from './content';
import apiRoutes from 'utils/apiRoutes';
import { ClientRoom } from 'client-room';

const GameContent = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      content(canvasRef.current);
    }
  }, []);

  return <canvas ref={canvasRef}/>;
};

export default () => {
  const [initialized, setInitialized] = useState(true);


  const joinGame = useCallback(() => {
    const gameRoom = new ClientRoom();
    gameRoom.on('INIT', initialData => {
      console.log('initialData:', initialData);
      setInitialized(true);
    });
    gameRoom.join(apiRoutes.joinGame())
      .then(() => {
        //#Loading assets from being told by locality.
        //#loadingmanager & how to load them before game. does assetclass keep hold of it? etc.

        // Loading of assets & models ... this will likely require relaying to game, with LoadingManager. Though,
        // we also need to be connected already, so we can grab the necessary assets from Locality. Can this be sent back in the
        // response in onClientAccepted?? (the room id does...) IT CANT BE SENT IN ONJOINREQUEST :DDDDDD Mention this in
        // the docs!! (also mention that the room id will be tacked on automatically)
        Promise.all([
          new Promise(resolve => {
            gameRoom.on('connect', resolve);
          }),
          new Promise(resolve => {
            //Simulate loading assets, etc.
            //Create progress bar and load it... (text 4 naiow; fleshing it out can be an @ work thing)
            //THREE.LoadingManager
            //LoadingManager.onFinished()

            //TODO LoadingManager needs to be declared... or in scope, here. (it coul dbe a singleton.)
            // i need pen/paper to do this...... for now, just have a singleton model, and singleton factories
            // how to pass it through to the app is the challenge.
            // First off, keep in mind this is a dumb frontend.
            // Model will be a singleton... it'll be immutable to the render loop

            setTimeout(resolve, 2000);
          })
        ]).then(() => gameRoom.emit('CLIENT_INITIALIZED')); // Used with RoomWithInitialization
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <>
      {initialized ?
        <GameContent /> : <button onClick={joinGame}>login</button>
      }
    </>
  );
}
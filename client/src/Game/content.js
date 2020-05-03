import {
  AmbientLight,
  BoxGeometry,
  Clock,
  LoadingManager,
  Mesh,
  MeshLambertMaterial,
  MeshPhongMaterial,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  PointLightHelper,
  Raycaster,
  Scene,
  SphereGeometry,
  Vector2,
  WebGLRenderer
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import BasicKnightFactory from 'Game/assetUtils/factories/BasicKnightFactory';
import lighting from './lighting';

const raycaster = new Raycaster();
const mouse = new Vector2();
const clock = new Clock();


mouse.clicked = false;

const onMouseMove = event => {

  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components

  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

};

window.addEventListener( 'mousemove', onMouseMove, false );

export default function content(canvasEle) {

  const ENTITIES_TO_LOAD = 'basic_knight';

  //RENDERER
  const renderer = new WebGLRenderer({ canvas: canvasEle, antialias: true });
  renderer.setClearColor(0x333333);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  //SCENE
  const scene = new Scene();

  //ACTIVE OBJECT
  let activeObj;

  //Mock model
  const model = [];

  //MATERIALS
  const material = new MeshLambertMaterial();
  const material2 = new MeshPhongMaterial({ color: 0xcccccc, specular: 0x999999, shininess: 30 });
  const material3 = new MeshStandardMaterial();

  //GEOMETRY

  const geometry = new BoxGeometry(100, 100, 100, 10, 10, 10);
  const geometry2 = new SphereGeometry(50, 20, 20);
  const geometry3 = new PlaneGeometry(10000, 10000, 100, 100);

  const cube = new Mesh(geometry, material);
  cube.position.z = 0;
  cube.position.x = 500;
  cube.position.y = -50;
  scene.add(cube);

  const ball = new Mesh(geometry2, material2);
  ball.position.z = 500;
  ball.position.x = 0;
  ball.position.y = -50;
  ball.castShadow = true;
  scene.add(ball);

  const mesh3 = new Mesh(geometry3, material3);
  mesh3.rotation.x = -90 * (Math.PI / 180);
  mesh3.position.y = -100;
  scene.add(mesh3);

  const light = lighting(scene, renderer);

  const basicKnightFactory = new BasicKnightFactory();
  basicKnightFactory.load()
    .then(() => {
      const player = basicKnightFactory.createInstance();
      model.push(player);
      scene.add(player.scene);

      const npc = basicKnightFactory.createInstance();
      scene.add(npc.scene);
      model.push(npc);

      activeObj = player;
    });

  cube.castShadow = true;
  ball.receiveShadow = true;
  mesh3.receiveShadow = true;

  //Perspective camera
  const camera = new PerspectiveCamera(35, window.innerWidth / window.innerHeight, 300, 10000 );
  const controls = new OrbitControls(camera, renderer.domElement);
  camera.position.set(0, 800, 0);
  camera.lookAt(light.position);
  controls.update();

  canvasEle.addEventListener('contextmenu', e => {
    e.preventDefault();
    mouse.clicked = true;
  });

  //RENDER LOOP
  render();
  function render() {

    const delta = clock.getDelta();

    if (activeObj && activeObj.scene) {
      raycaster.setFromCamera( mouse, camera );
      // calculate objects intersecting the picking ray
      const intersects = raycaster.intersectObjects( scene.children );
      for ( let i = 0; i < intersects.length; i++ ) {
        if (mouse.clicked) {
          mouseClickedAt(intersects[i], activeObj);
        }
      }
    }

    model.forEach(item => item.update(delta));


    controls.update();
    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
}

function mouseClickedAt(object, activeObj) {
  if (activeObj && activeObj.scene) {
    const point = object.point;
    activeObj.moveTo(point);
    mouse.clicked = false;
  }
}
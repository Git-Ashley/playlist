import {AmbientLight, PCFSoftShadowMap, PointLight, PointLightHelper} from "three";

const lighting = (scene, renderer) => {
  //ambient light
  const ambientLight = new AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);


  // pointlight
  const light = new PointLight(0xffffff, 1.0, 1000);
  scene.add(light);
  const pointLightHelper = new PointLightHelper(light);
  scene.add(pointLightHelper);

  //shadows
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;

  light.position.y = 100;
  light.position.z = -100;
  //light.target = mesh;
  light.castShadow = true;
  light.shadow.camera.far = 1000;
  light.shadow.camera.near = 1;
  light.shadow.camera.aspect = 1;
  light.shadow.camera.fov = 90;
  //light.shadow.bias = 0.0001;
  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;
  light.dest = null;
  scene.add(light);

  return light;
  // directionallight
  // var light = new THREE.DirectionalLight(0xffffff, 2.0, 1000);
  // light.target = mesh;
  // scene.add(light);
  //
  // var directionalLightHelper = new THREE.DirectionalLightHelper(light, 100);
  // scene.add(directionalLightHelper);


  // spotlight
  /*var light = new THREE.SpotLight(0xffffff, 2.0, 1000);
  light.target = mesh;
  scene.add(light);
  var spotLightHelper = new THREE.SpotLightHelper(light);
  scene.add(spotLightHelper);
  */

  // hemisphere light
  // var light = new THREE.HemisphereLight(0xffffbb, 0x0808dd, 1);
  // scene.add(light);
  //
  // var hemisphereLightHelper = new THREE.HemisphereLightHelper(light, 100);
  // scene.add(hemisphereLightHelper);
};

export default lighting;
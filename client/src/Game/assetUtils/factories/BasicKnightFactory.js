import {Matrix4, MeshPhongMaterial, MeshStandardMaterial} from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import {SkeletonUtils} from 'three/examples/jsm/utils/SkeletonUtils.js';
import AnimatedEntity from 'Game/assetUtils/entity/AnimatedEntity';

function setWeight( action, weight ) {

  action.enabled = true;
  action.setEffectiveTimeScale( 1 );
  action.setEffectiveWeight( weight );

}

class Being extends AnimatedEntity {
  _stroll = false;
  _runningThreshold = 6;
  _walkingSpeed = 3;

  set stroll(isStroll) {
    this._stroll = isStroll;
  }

  _setupAnimations(...args) {
    super._setupAnimations(...args);
    this.stand();
  }

  onStop() {
    this.stand();
  }

  moveTo(point) {
    super.moveTo(point);
    if(this._stroll || this._speed < this._runningThreshold) {
      this.walk();
    } else {
      //TODO this.run();
    }
  }

  walk() {
    //TODO Set speed of animation based on this._speed, or this._walkingSpeed if this._stroll == true
    this._animations.walk.play();
    setWeight( this._animations.walk, 1 );
    this._animations.walk.time = 0;
    if(this._currentAnimation) {
      this._currentAnimation.crossFadeTo(this._animations.walk, 0.5, true);
    }
    this._currentAnimation = this._animations.walk;
  }

  stand() {
    this._animations.stand.play();
    setWeight( this._animations.stand, 1 );
    this._animations.stand.time = 0;
    if (this._currentAnimation) {
      this._currentAnimation.crossFadeTo(this._animations.stand, 0.5, true);
    }
    this._currentAnimation = this._animations.stand;
  }
}

class BasicKnight extends Being {
  //This guy has nothing unique about him :/
}

class BasicKnightFactory {
  constructor() {
    this.output = 'BasicKnight';
    this.animations = null;
    this.gltf = null;
    this.isLoaded = false;

  }

  load() {
    const loader = new GLTFLoader();
    return new Promise((resolve, reject) => {
      if (!this.isLoaded) {
        loader.load(
          '/assets/gltf/small-knight/knight.glb',
          gltf => {
            this.gltf = gltf;
            this.isLoaded = true;

            const metal1 = new MeshStandardMaterial({color: 0xffffff, metalness: 0.5, roughness: 0.5, skinning: true});
            const metal2 = new MeshPhongMaterial({color: 0xcccccc, specular: 0x999999, shininess: 50, skinning: true});

            this.animations = {
              stand: gltf.animations[0],
              walk: gltf.animations[2],
              attack: gltf.animations[4]
            };

            gltf.scene.traverse(child => {
              if (child.isMesh) {
                console.log('child:', child);
                child.castShadow = true;
                child.material = metal2;
              }
            });
            gltf.scene.scale.set(50, 50, 50); // scale here
            gltf.scene.applyMatrix(new Matrix4().makeScale(-1, 1, 1));
            gltf.scene.position.y = -100;
            resolve();
          },
          xhr => console.log((xhr.loaded / xhr.total * 100) + '% loaded'),
          reject
        );
      } else {
        resolve();
      }
    });
  }

  createInstance() {
    if (!this.isLoaded) {
      throw `Tried to get instance of ${this.output} from ${this.output}Factory, but asset is not loaded.`;
    }

    const basicKnightTemplate = SkeletonUtils.clone(this.gltf.scene);
    return new BasicKnight({
      scene: basicKnightTemplate,
      animations: this.animations
    });
  }
}

export default BasicKnightFactory
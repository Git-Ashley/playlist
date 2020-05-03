import {AnimationMixer} from "three";


export default class {
  constructor({ scene, animations }) {
    this.scene = scene;

    this._dest = null;
    this._dx = 0;
    this._dz = 0;
    this._vx = 0;
    this._vz = 0;

    this._naturalSpeed = 3;
    this._speed = this._naturalSpeed; //plus modifiers

    this._currentAnimation = null;
    this._animations = {};

    this._setupAnimations(animations);
  }

  get position() { return this.scene.position; }

  _setupAnimations(animationTemplates) {
    this.mixer = new AnimationMixer(this.scene);

    Object.entries(animationTemplates).forEach(([animationName, animationTemplate]) => {
      this._animations[animationName] = this.mixer.clipAction(animationTemplate);
    });
  }

  _setVelocity(x, z) {
    this._vx = x;
    this._vz = z;
  }

  _setRotation(radians) {
    this.scene.rotation.y = radians;
  }


  update(delta) {
    const multiplier = delta*30;
    this.mixer.update(delta);

    if (this._dest && !isNaN(this._dest.x) && !isNaN(this._dest.z)) {
      // Destination reached
      const currentDx = this._dest.x - this.position.x;
      const currentDz = this.position.z - this._dest.z;
      if (currentDx * this._dx <= 0 && currentDz * this._dz <= 0) {
        this._dest = null;
        this._setVelocity(0, 0);
        this._dx = 0;
        this._dz = 0;
        this.onStop();
      } else {
        // Still heading to object.dest
        this.position.x += multiplier * this._vx;
        this.position.z += multiplier * this._vz;
      }
    }
  }

  moveTo(point) {
    this._dest = point;
  
    //calculate direction
    const dx = this._dest.x - this.position.x;
    const dz = this.position.z - this._dest.z;
    this._dx = dx;
    this._dz = dz;
    let θ;
    if(dx >= 0)
      θ = Math.atan(dz/dx);
    else
      θ = Math.PI + Math.atan(dz/dx);

    this._setRotation(θ + 0.5*Math.PI);

    this._setVelocity(this._speed*Math.cos(θ), (-1)*this._speed*Math.sin(θ));
  }
}
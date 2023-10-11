import Servo from "./Servo.js";
import { required } from '../common/funcs.js';
import { degToRad } from "../common/rads.js";

class Leverage {
  #servo;
  #width;  
  #leverage;
  
  constructor({
    width = required('Leverage width is required in millimeters'),
    minDeg,
    maxDeg,
    leverage,
    pin
  }) {
    this.#servo = new Servo({ pin, minDeg, maxDeg });
    this.#width = width;    
    this.#leverage = leverage;
  }

  get leverage() { return this.#leverage; }
  get servo() { return this.#servo; }
  get width() { return this.#width; }

}

export class LeverageY extends Leverage {  
  get position() {
    const rad = degToRad(this.servo.degree);
    const baseX = this.leverage ? this.leverage.x : 0;
    const baseY = this.leverage ? this.leverage.y : 0;
    const baseZ = this.leverage ? this.leverage.z + this.baseZ: this.baseZ;
    const yDeg =  this.leverage ? this.leverage.yDeg : 0;
    const yRad = degToRad(yDeg);
    const xr = this.width * Math.cos(rad) * Math.cos(yRad);
    const yr = this.width * Math.cos(yRad);
    const zr = this.width * Math.sin(rad) * Math.sin(yRad);
    return {
      x: xr + baseX,
      y: yr + baseY,
      z: zr + baseZ
    }
  }
}

export class LeverageZ extends Leverage {  
  get position() {
    const rad = degToRad(this.servo.degree);
    const baseX = this.leverage ? this.leverage.x : 0;
    const baseY = this.leverage ? this.leverage.y : 0;
    const baseZ = this.leverage ? this.leverage.z + this.baseZ : this.baseZ;
    const xDeg =  this.leverage ? this.leverage.xDeg : 0;
    const xRad = degToRad(xDeg);
    const xr = this.width * Math.cos(xRad);    
    const yr = this.width * Math.cos(rad) * Math.cos(xRad);
    const zr = this.width * Math.sin(rad) * Math.sin(xRad);
    return {
      x: xr + baseX,
      y: yr + baseY,
      z: zr + baseZ
    }
  }
}

export class LeverageX extends Leverage {  
  get position() {
    const rad = degToRad(this.servo.degree);
    const baseX = this.leverage ? this.leverage.x : 0;
    const baseY = this.leverage ? this.leverage.y : 0;
    const baseZ = this.leverage ? this.leverage.z + this.baseZ : this.baseZ;
    const xDeg =  this.leverage ? this.leverage.xzDeg : 0;
    const xRad = degToRad(xDeg);
    const xr = this.width * Math.cos(xRad);    
    const yr = this.width * Math.cos(rad) * Math.cos(xRad);
    const zr = this.width * Math.sin(rad) * Math.sin(xRad);
    return {
      x: xr + baseX,
      y: yr + baseY,
      z: zr + baseZ
    }
  }
}
import { pulseWidthToDuty } from '../gpio/PWM.js';
import { required } from '../common/funcs.js';

export default class Servo {
  #minPulseWidth = 500;
  #maxPulseWidth = 2500;
  #minDeg = 0;
  #maxDeg = 270
  #stepWidth;
  #currentPulseWidth = 500;
  #pin;

  #degToPulseWidth(deg) {    
    return this.#stepWidth * deg + this.#minPulseWidth;
  }

  #pulseWidthToDeg(pulseWidth) {    
    return pulseWidth / this.#stepWidth - this.#minPulseWidth;
  }

  constructor ({ 
    minPulseWidth, 
    maxPulseWidth,  
    minDeg, 
    maxDeg, 
    pin = required('Must be RaspberryPi GPIO') }) 
  {
    minImpulse ?? (this.#minPulseWidth = minPulseWidth);
    maxImpulse ?? (this.#maxPulseWidth = maxPulseWidth);
    minDeg ?? (this.#minDeg = minDeg);
    maxDeg ?? (this.#maxDeg = maxDeg);
    const deltaDeg = Math.abs(this.#maxDeg - this.#minDeg);
    const deltaWidth = Math.abs(this.#maxPulseWidth - this.#minPulseWidth);
    this.#stepWidth = deltaWidth / deltaDeg;
    this.#pin = pin;
  }

  get command() {
    return `${this.#pin}=${pulseWidthToDuty(this.#currentPulseWidth)}`;
  }

  set degree(value) {
    this.#currentPulseWidth = this.#degToPulseWidth(value);
  }

  get degree() {
    return this.#pulseWidthToDeg(this.#currentPulseWidth);
  }
}
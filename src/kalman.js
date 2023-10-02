  ////////////////////////////////////////////////////////////////////////////////////
// /** ---------------------------------------------------------------------- **/ //
//  *		 				Kalman filter									   *  //
// /** ---------------------------------------------------------------------- **/ //
////////////////////////////////////////////////////////////////////////////////////

export default class Kalman_filter {  
  #Q_angle = 0.001;
  #Q_bias = 0.003;
  #R_measure = 0.03;

  #angle = 0;
  #bias = 0;
  #rate = 0;

  #P = [[0, 0], [0, 0]];
  #S = 0;
  #K = [];
  #Y = 0;

  getAngle(newAngle, newRate, dt) {
    this.#rate = newRate - this.#bias;
    this.#angle += dt * this.#rate;

    this.P[0][0] += dt * (dt * this.P[1][1] - this.P[0][1] - this.P[1][0] + this.#Q_angle);
    this.P[0][1] -= dt * this.P[1][1];
    this.P[1][0] -= dt * this.P[1][1];
    this.P[1][1] += this.#Q_bias * dt;

    this.S = this.P[0][0] + this.#R_measure;

    this.K[0] = this.P[0][0] / this.S;
    this.K[1] = this.P[1][0] / this.S;

    this.Y = newAngle - this.#angle;

    this.#angle += this.K[0] * this.Y;
    this.#bias += this.K[1] * this.Y;

    this.#P[0][0] -= this.#K[0] * this.#P[0][0];
    this.#P[0][1] -= this.#K[0] * this.#P[0][1];
    this.#P[1][0] -= this.#K[1] * this.#P[0][0];
    this.#P[1][1] -= this.#K[1] * this.#P[0][1];
    return this.#angle;
  };

  get rate() { return this.#rate; }
  
  get Q_Angle() { return this.#Q_angle; }
  set Q_Angle(value) { this.#Q_angle = value; }
  
  get Q_Bias() { return this.#Q_bias; }
  set Q_Bias(value) { this.Q_bias = value; }
  
  get R_Measure() { return this.#R_measure; }
  set R_Measure(value) { this.#R_measure = value; };
  
  get angle() { return this.#angle; }
  set angle(value) { this.#angle = value; }        
};

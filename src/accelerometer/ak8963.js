import DebugConsole from "../iic/DebugConsole.js";
import LOCAL_I2C from "../iic/localI2c.js";
import sleep from "../common/sleep.js";

/****************/
/** AK8963 MAP **/
/****************/
// Technical documentation available here: https://www.akm.com/akm/en/file/datasheet/AK8963C.pdf
export const AK8963 = {
  ADDRESS: 0x0C,
  WHO_AM_I: 0x00, // should return 0x48,
  WHO_AM_I_RESPONSE: 0x48,
  INFO: 0x01,
  ST1: 0x02,  // data ready status bit 0
  XOUT_L: 0x03,  // data
  XOUT_H: 0x04,
  YOUT_L: 0x05,
  YOUT_H: 0x06,
  ZOUT_L: 0x07,
  ZOUT_H: 0x08,
  ST2: 0x09,  // Data overflow bit 3 and data read error status bit 2
  CNTL: 0x0A,  // Power down (0000), single-measurement (0001), self-test (1000) and Fuse ROM (1111) modes on bits 3:0
  ASTC: 0x0C,  // Self test control
  I2CDIS: 0x0F,  // I2C disable
  ASAX: 0x10,  // Fuse ROM x-axis sensitivity adjustment value
  ASAY: 0x11,  // Fuse ROM y-axis sensitivity adjustment value
  ASAZ: 0x12,

  ST1_DRDY_BIT: 0,
  ST1_DOR_BIT: 1,

  CNTL_MODE_OFF: 0x00, // Power-down mode
  CNTL_MODE_SINGLE_MEASURE: 0x01, // Single measurement mode
  CNTL_MODE_CONTINUE_MEASURE_1: 0x02, // Continuous measurement mode 1 - Sensor is measured periodically at 8Hz
  CNTL_MODE_CONTINUE_MEASURE_2: 0x06, // Continuous measurement mode 2 - Sensor is measured periodically at 100Hz
  CNTL_MODE_EXT_TRIG_MEASURE: 0x04, // External trigger measurement mode
  CNTL_MODE_SELF_TEST_MODE: 0x08, // Self-test mode
  CNTL_MODE_FUSE_ROM_ACCESS: 0x0F,  // Fuse ROM access mode

  DEFAULT_CALIBRATION: {
    offset: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 }
  }
};

////////////////////////////////////////////////////////////////////////////////////
// /** ---------------------------------------------------------------------- **/ //
//  *		 					Magnetometer Configuration					   *  //
// /** ---------------------------------------------------------------------- **/ //
////////////////////////////////////////////////////////////////////////////////////

export class ak8963 {
  #config;
  #debug = new DebugConsole(this.#config.DEBUG);
  #i2c = new LOCAL_I2C(this.#config.ak_address, { device: this.#config.device });
  
  constructor(config) {
    this.#config = config;
    this.#config.ak_address = this.#config.ak_address || AK8963.ADDRESS;
    this.#config.magCalibration = this.#config.magCalibration || AK8963.DEFAULT_CALIBRATION;
    
  }
  
  async initialization() {
    const buffer = await this.getIDDevice();

    if (buffer & AK8963.WHO_AM_I_RESPONSE) {
      this.getSensitivityAdjustmentValues();
      await sleep.sleep(1);
      await this.setCNTL(AK8963.CNTL_MODE_CONTINUE_MEASURE_2);
    } else {
      this.#debug.Log('ERROR', 'AK8963: Device ID is not equal to 0x' + AK8963.WHO_AM_I_RESPONSE.toString(16) + ', device value is 0x' + buffer.toString(16));
    }
  }
  
  async printSettings() {
    const MODE_LST = {
      0: '0x00 (Power-down mode)',
      1: '0x01 (Single measurement mode)',
      2: '0x02 (Continuous measurement mode 1: 8Hz)',
      6: '0x06 (Continuous measurement mode 2: 100Hz)',
      4: '0x04 (External trigger measurement mode)',
      8: '0x08 (Self-test mode)',
      15: '0x0F (Fuse ROM access mode)'
    };

    const deviceId = await this.getIDDevice();
    this.#debug.Log('INFO', 'Magnetometer (Compass):');
    this.#debug.Log('INFO', '--> i2c address: 0x' + this.#config.ak_address.toString(16));
    this.#debug.Log('INFO', '--> Device ID: 0x' + deviceId.toString(16));
    this.#debug.Log('INFO', '--> Mode: ' + MODE_LST[this.getCNTL() & 0x0F]);
    this.#debug.Log('INFO', '--> Scalars:');
    this.#debug.Log('INFO', '  --> x: ' + this.asax);
    this.#debug.Log('INFO', '  --> y: ' + this.asay);
    this.#debug.Log('INFO', '  --> z: ' + this.asaz);
  };

  async getDataReady() {
    return await this.#i2c.readBit(AK8963.ST1, AK8963.ST1_DRDY_BIT);
  }

  async getIDDevice() {  
    return this.#i2c.readByte(AK8963.WHO_AM_I);
  }

  /**
    *  Get the Sensitivity Adjustment values.  These were set during manufacture and allow us to get the actual H values
    * from the magnetometer.
    * @name getSensitivityAdjustmentValues
    */
  async getSensitivityAdjustmentValues() {
    if (!this.#config.scaleValues) {
      this.asax = 1;
      this.asay = 1;
      this.asaz = 1;
      return;
    }

    // Need to set to Fuse mode to get valid values from this.
    const currentMode = this.getCNTL();
    await this.setCNTL(AK8963.CNTL_MODE_FUSE_ROM_ACCESS);
    await sleep.sleep(1);
    
    const asax = await this.i2c.readByte(AK8963.ASAX)
    const asay = await this.i2c.readByte(AK8963.ASAY)
    const asaz = await this.i2c.readByte(AK8963.ASAZ)
    this.asax = ((asax - 128) * 0.5 / 128 + 1);
    this.asay = ((asay - 128) * 0.5 / 128 + 1);
    this.asaz = ((asaz - 128) * 0.5 / 128 + 1);

    // Return the mode we were in before
    this.setCNTL(currentMode);
  }

  /**
   * Get the raw magnetometer values
   * @name getMagAttitude
   * @return array
   */
  async getMagAttitude() {
    // Get the actual data
    const buffer = this.#i2c.readBytes(AK8963.XOUT_L, 6);
    const cal = this.#config.magCalibration;

    // For some reason when we read ST2 (Status 2) just after reading byte, this ensures the
    // next reading is fresh.  If we do it before without a pause, only 1 in 15 readings will
    // be fresh.  The setTimeout ensures this read goes to the back of the queue, once all other
    // computation is done.
    setTimeout(async () => {
      await this.#i2c.readByte(AK8963.ST2);
    }, 0);

    return [
      ((buffer.readInt16LE(0) * this.asax) - cal.offset.x) * cal.scale.x,
      ((buffer.readInt16LE(2) * this.asay) - cal.offset.y) * cal.scale.y,
      ((buffer.readInt16LE(4) * this.asaz) - cal.offset.z) * cal.scale.z
    ];
  }

  async getCNTL() {  
    return await this.#i2c.readByte(AK8963.CNTL);  
  }

  /**---------------------|[ SET ]|--------------------**/

  /**
   * @name setCNTL
   * CNTL_MODE_OFF: 0x00, // Power-down mode
   * CNTL_MODE_SINGLE_MEASURE: 0x01, // Single measurement mode
   * CNTL_MODE_CONTINUE_MEASURE_1: 0x02, // Continuous measurement mode 1
   * CNTL_MODE_CONTINUE_MEASURE_2: 0x06, // Continuous measurement mode 2
   * CNTL_MODE_EXT_TRIG_MEASURE: 0x04, // External trigger measurement mode
   * CNTL_MODE_SELF_TEST_MODE: 0x08, // Self-test mode
   * CNTL_MODE_FUSE_ROM_ACCESS: 0x0F  // Fuse ROM access mode
   * @return undefined | false
   */
  async setCNTL(mode) {    
    return await this.i2c.writeBytes(AK8963.CNTL, [mode], function () { });    
  }
}
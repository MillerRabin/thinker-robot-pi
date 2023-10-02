/*****************/
/** MPU9250_CONSTS MAP **/
/*****************/
// documentation:
//   https://www.invensense.com/products/motion-tracking/9-axis/mpu-9250/
//   https://www.invensense.com/wp-content/uploads/2015/02/MPU-9250-Datasheet.pdf
//   https://www.invensense.com/wp-content/uploads/2015/02/MPU-9250-Register-Map.pdf

import LOCAL_I2C from "./localI2c.js";
import DebugConsole from "./DebugConsole.js";
import sleep from "./sleep.js";
import { ak8963, AK8963 } from "./ak8963.js";

const MPU9250_CONSTS = {
  ID_MPU_9250: 0x71,
  ID_MPU_9255: 0x73,

  I2C_ADDRESS_AD0_LOW: 0x68,
  I2C_ADDRESS_AD0_HIGH: 0x69,
  WHO_AM_I: 0x75,

  SMPLRT_DIV: 0x19,
  RA_CONFIG: 0x1A,
  RA_GYRO_CONFIG: 0x1B,
  RA_ACCEL_CONFIG_1: 0x1C,
  RA_ACCEL_CONFIG_2: 0x1D,

  RA_INT_PIN_CFG: 0x37,

  INTCFG_ACTL_BIT: 7,
  INTCFG_OPEN_BIT: 6,
  INTCFG_LATCH_INT_EN_BIT: 5,
  INTCFG_INT_ANYRD_2CLEAR_BIT: 4,
  INTCFG_ACTL_FSYNC_BIT: 3,
  INTCFG_FSYNC_INT_MODE_EN_BIT: 2,
  INTCFG_BYPASS_EN_BIT: 1,
  INTCFG_NONE_BIT: 0,

  // BY_PASS_MODE: 0x02,

  ACCEL_XOUT_H: 0x3B,
  ACCEL_XOUT_L: 0x3C,
  ACCEL_YOUT_H: 0x3D,
  ACCEL_YOUT_L: 0x3E,
  ACCEL_ZOUT_H: 0x3F,
  ACCEL_ZOUT_L: 0x40,
  TEMP_OUT_H: 0x41,
  TEMP_OUT_L: 0x42,
  GYRO_XOUT_H: 0x43,
  GYRO_XOUT_L: 0x44,
  GYRO_YOUT_H: 0x45,
  GYRO_YOUT_L: 0x46,
  GYRO_ZOUT_H: 0x47,
  GYRO_ZOUT_L: 0x48,

  RA_USER_CTRL: 0x6A,
  RA_PWR_MGMT_1: 0x6B,
  RA_PWR_MGMT_2: 0x6C,
  PWR1_DEVICE_RESET_BIT: 7,
  PWR1_SLEEP_BIT: 6,
  PWR1_CLOCK_SOURCE_MASK: 0x07,
  PWR1_CYCLE_BIT: 5,
  PWR1_TEMP_DIS_BIT: 3, // (PD_PTAT)
  PWR1_CLKSEL_BIT: 0,
  PWR1_CLKSEL_LENGTH: 3,

  GCONFIG_FS_SEL_BIT: 3,
  GCONFIG_FS_SEL_LENGTH: 2,
  GYRO_FS_250: 0x00,
  GYRO_FS_500: 0x01,
  GYRO_FS_1000: 0x02,
  GYRO_FS_2000: 0x03,
  GYRO_SCALE_FACTOR: [131, 65.5, 32.8, 16.4],

  ACONFIG_FS_SEL_BIT: 3,
  ACONFIG_FS_SEL_LENGTH: 2,
  ACCEL_FS_2: 0x00,
  ACCEL_FS_4: 0x01,
  ACCEL_FS_8: 0x02,
  ACCEL_FS_16: 0x03,
  ACCEL_SCALE_FACTOR: [16384, 8192, 4096, 2048],

  CLOCK_INTERNAL: 0x00,
  CLOCK_PLL_XGYRO: 0x01,
  CLOCK_PLL_YGYRO: 0x02,
  CLOCK_PLL_ZGYRO: 0x03,
  CLOCK_KEEP_RESET: 0x07,
  CLOCK_PLL_EXT32K: 0x04,
  CLOCK_PLL_EXT19M: 0x05,

  I2C_SLV0_DO: 0x63,
  I2C_SLV1_DO: 0x64,
  I2C_SLV2_DO: 0x65,

  USERCTRL_DMP_EN_BIT: 7,
  USERCTRL_FIFO_EN_BIT: 6,
  USERCTRL_I2C_MST_EN_BIT: 5,
  USERCTRL_I2C_IF_DIS_BIT: 4,
  USERCTRL_DMP_RESET_BIT: 3,
  USERCTRL_FIFO_RESET_BIT: 2,
  USERCTRL_I2C_MST_RESET_BIT: 1,
  USERCTRL_SIG_COND_RESET_BIT: 0,

  DEFAULT_GYRO_OFFSET: { x: 0, y: 0, z: 0 },
  DEFAULT_ACCEL_CALIBRATION: {
    offset: { x: 0, y: 0, z: 0 },
    scale: {
      x: [-1, 1],
      y: [-1, 1],
      z: [-1, 1]
    }
  },

  /** For Gyro */
  DLPF_CFG_250HZ: 0x00,
  DLPF_CFG_184HZ: 0x01,
  DLPF_CFG_92HZ: 0x02,
  DLPF_CFG_41HZ: 0x03,
  DLPF_CFG_20HZ: 0x04,
  DLPF_CFG_10HZ: 0x05,
  DLPF_CFG_5HZ: 0x06,
  DLPF_CFG_3600HZ: 0x07,

  /** Sample rate min/max value */
  SAMPLERATE_MIN: 5,
  SAMPLERATE_MAX: 32000,

  /** For accel. */
  A_DLPF_CFG_460HZ: 0x00,
  A_DLPF_CFG_184HZ: 0x01,
  A_DLPF_CFG_92HZ: 0x02,
  A_DLPF_CFG_41HZ: 0x03,
  A_DLPF_CFG_20HZ: 0x04,
  A_DLPF_CFG_10HZ: 0x05,
  A_DLPF_CFG_5HZ: 0x06,
  A_DLPF_CFG_460HZ_2: 0x07,
  A_DLPF_CFG_MASK: 0x07,
};

function scaleAccel(val, offset, scalerArr) {
  if (val < 0) {
    return -(val - offset) / (scalerArr[0] - offset);
  } else {
    return (val - offset) / (scalerArr[1] - offset);
  }
}

////////////////////////////////////////////////////////////////////////////////////
// /** ---------------------------------------------------------------------- **/ //
//  *		 						MPU Configuration						   *  //
// /** ---------------------------------------------------------------------- **/ //
////////////////////////////////////////////////////////////////////////////////////

export class MPU9250 {
  #config = {
    device: '/dev/i2c-1',
    address: MPU9250_CONSTS.I2C_ADDRESS_AD0_LOW,
    UpMagneto: false,
    DEBUG: true,
    scaleValues: false,
    ak_address: AK8963.ADDRESS,
    GYRO_FS: 0,
    ACCEL_FS: 2,
    gyroBiasOffset: MPU9250_CONSTS.DEFAULT_GYRO_OFFSET,
    accelCalibration: MPU9250_CONSTS.DEFAULT_ACCEL_CALIBRATION
  };

  #i2c;
  #debug;
  #ak8963;
  #pwr1;
  #pwr2;
  
  constructor (cfg = {}) {   
    this.#config = { ...this.#config, ...cfg };
    this.#i2c = new LOCAL_I2C(this.#config.address, { device: this.#config.device });
    this.#debug = new DebugConsole(this.#config.DEBUG);
  };

  async initialize() {
    this.#debug.Log('INFO', 'Initialization MPU9250 ....');
    await this.#i2c.writeBit(MPU9250_CONSTS.RA_PWR_MGMT_1, MPU9250_CONSTS.PWR1_DEVICE_RESET_BIT, 1);
    this.#debug.Log('INFO', 'Reset configuration MPU9250.');
    await sleep.sleep(1);
    
    if ('SAMPLE_RATE' in this.#config && 
        this.#config.SAMPLE_RATE && 
        (this.#config.SAMPLE_RATE > MPU9250_CONSTS.SAMPLERATE_MIN && 
        this.#config.SAMPLE_RATE < MPU9250_CONSTS.SAMPLERATE_MAX)
      ) {
        await this.setSampleRate(this.#config.SAMPLE_RATE);
        await sleep.sleep(1);
      }

    if ('DLPF_CFG' in this.#config && this.#config.DLPF_CFG) {
      await this.setDLPFConfig(this.#config.DLPF_CFG);
      await sleep.sleep(1);
    }

    if ('A_DLPF_CFG' in this.#config && this.#config.A_DLPF_CFG) {
      await this.setAccelDLPFConfig(this.#config.DLPF_CFG);
      await sleep.sleep(1);
    }
  
    await this.setClockSource(MPU9250_CONSTS.CLOCK_PLL_XGYRO);
    await sleep.sleep(1);

    const gyro_fs = [MPU9250_CONSTS.GYRO_FS_250, MPU9250_CONSTS.GYRO_FS_500, MPU9250_CONSTS.GYRO_FS_1000, MPU9250_CONSTS.GYRO_FS_2000];
    const gyro_value = (this.#config.GYRO_FS > -1 && this.#config.GYRO_FS < 4) ? gyro_fs[this.#config.GYRO_FS] : MPU9250_CONSTS.GYRO_FS_250;
    await this.setFullScaleGyroRange(gyro_value);
    await sleep.sleep(1);

    const accel_fs = [MPU9250_CONSTS.ACCEL_FS_2, MPU9250_CONSTS.ACCEL_FS_4, MPU9250_CONSTS.ACCEL_FS_8, MPU9250_CONSTS.ACCEL_FS_16];
    const accel_value = (this.#config.ACCEL_FS > -1 && this.#config.ACCEL_FS < 4) ? accel_fs[this.#config.ACCEL_FS]: MPU9250_CONSTS.ACCEL_FS_4;
  
    await this.setFullScaleAccelRange(accel_value);
    await sleep.sleep(1);

    await this.setSleepEnabled(false);
    await sleep.sleep(1);

    if (this.#config.UpMagneto) {
      this.#debug.Log('INFO', 'Enabled magnetometer. Starting initialization ....');
      await this.enableMagnetometer();
      this.#debug.Log('INFO', 'END of magnetometer initialization.');
    }
    
    this.#debug.Log('INFO', 'END of MPU9150 initialization.');
    if (this.#config.DEBUG) {
      await this.printSettings();
      await this.printAccelSettings();
      await this.printGyroSettings();
      if (this.#ak8963) {
        await this.#ak8963.printSettings();
      }
    }

    return await this.testDevice();
  };

  async testDevice() {
    const currentDeviceID = await this.getIDDevice();
    return (currentDeviceID === MPU9250_CONSTS.ID_MPU_9250 || currentDeviceID === MPU9250_CONSTS.ID_MPU_9255);
  }

  async enableMagnetometer() {
    if (!this.i2c) return false;
    
    await this.setI2CMasterModeEnabled(false);
    await sleep.sleep(1);

    await this.setByPASSEnabled(true);
    await sleep.sleep(1);

    if (this.getByPASSEnabled()) {
      this.#ak8963 = new ak8963(this.#config);
      return true;
    } else {
      this.#debug.Log('ERROR', 'Can\'t turn on RA_INT_PIN_CFG.');
    }
  }

  async getIDDevice() {    
    return await this.#i2c.readByte(MPU9250_CONSTS.WHO_AM_I);    
  }

  async getTemperature() {    
    const buffer = await this.#i2c.read(MPU9250_CONSTS.TEMP_OUT_H, 2);
    return buffer.readInt16BE(0);    
  }

  async getTemperatureCelsius() {
    /*
      ((TEMP_OUT – RoomTemp_Offset)/Temp_Sensitivity) + 21degC
    */
    const TEMP_OUT = await this.getTemperatureCelsiusDigital();
    if (TEMP_OUT) {
      return TEMP_OUT + '°C';
    }
    return 'no data';
  }

  async getTemperatureCelsiusDigital() {
    const TEMP_OUT = await this.getTemperature();
    if (TEMP_OUT) {
      return (TEMP_OUT / 333.87) + 21.0;
    }
    return 0;
  }

  async getMotion6() {
    const buffer = await this.#i2c.read(MPU9250_CONSTS.ACCEL_XOUT_H, 14);
    const gCal = this.#config.gyroBiasOffset;
    const aCal = this.#config.accelCalibration;

    const xAccel = buffer.readInt16BE(0) * this.accelScalarInv;
    const yAccel = buffer.readInt16BE(2) * this.accelScalarInv;
    const zAccel = buffer.readInt16BE(4) * this.accelScalarInv;

    return [
      scaleAccel(xAccel, aCal.offset.x, aCal.scale.x),
      scaleAccel(yAccel, aCal.offset.y, aCal.scale.y),
      scaleAccel(zAccel, aCal.offset.z, aCal.scale.z),
      // Skip Temperature - bytes 6:7
      buffer.readInt16BE(8) * this.gyroScalarInv + gCal.x,
      buffer.readInt16BE(10) * this.gyroScalarInv + gCal.y,
      buffer.readInt16BE(12) * this.gyroScalarInv + gCal.z
    ];
  }
  
  async getMotion9() {    
    const mpudata = await this.getMotion6();
    const magdata = (this.#ak8963) ? await this.#ak8963.getMagAttitude() : [0, 0, 0];
    return mpudata.concat(magdata);
  }

  async getAccel() {    
    const buffer = await this.#i2c.read(MPU9250_CONSTS.ACCEL_XOUT_H, 6);
    const aCal = this.#config.accelCalibration;

    const xAccel = buffer.readInt16BE(0) * this.accelScalarInv;
    const yAccel = buffer.readInt16BE(2) * this.accelScalarInv;
    const zAccel = buffer.readInt16BE(4) * this.accelScalarInv;

    return [
      scaleAccel(xAccel, aCal.offset.x, aCal.scale.x),
      scaleAccel(yAccel, aCal.offset.y, aCal.scale.y),
      scaleAccel(zAccel, aCal.offset.z, aCal.scale.z)
    ];
  }

  async getGyro() {    
    const buffer = await this.#i2c.read(MPU9250_CONSTS.GYRO_XOUT_H, 6);
    const gCal = this.#config.gyroBiasOffset;
    return [
      buffer.readInt16BE(0) * this.gyroScalarInv + gCal.x,
      buffer.readInt16BE(2) * this.gyroScalarInv + gCal.y,
      buffer.readInt16BE(4) * this.gyroScalarInv + gCal.z
    ];
  }

  async getSleepEnabled() {    
    return await this.#i2c.readBit(MPU9250_CONSTS.RA_PWR_MGMT_1, MPU9250_CONSTS.PWR1_SLEEP_BIT);
  }

  async getClockSource() {    
    return await this.#i2c.readByte(MPU9250_CONSTS.RA_PWR_MGMT_1) & 0x07;
  }

  async getFullScaleGyroRange() {    
    let byte = await this.#i2c.readByte(MPU9250_CONSTS.RA_GYRO_CONFIG);
    byte = byte & 0x18;
    byte = byte >> 3;
    return byte;
  }

  async getGyroPowerSettings() {  
    let byte = await this.#i2c.readByte(MPU9250_CONSTS.RA_PWR_MGMT_2);
    byte = byte & 0x07;
    return [
      (byte >> 2) & 1,    // X
      (byte >> 1) & 1,    // Y
      (byte >> 0) & 1	    // Z
    ];
  }  

  async getAccelPowerSettings() {    
    let byte = await this.#i2c.readByte(MPU9250_CONSTS.RA_PWR_MGMT_2);
    byte = byte & 0x38;
    return [
      (byte >> 5) & 1,    // X
      (byte >> 4) & 1,    // Y
      (byte >> 3) & 1	    // Z
    ];
  }

  async getFullScaleAccelRange() {    
    let byte = await this.#i2c.readByte(MPU9250_CONSTS.RA_ACCEL_CONFIG_1);
    byte = byte & 0x18;
    byte = byte >> 3;
    return byte;  
  }

  async getByPASSEnabled() {    
    return await this.#i2c.readBit(MPU9250_CONSTS.RA_INT_PIN_CFG, MPU9250_CONSTS.INTCFG_BYPASS_EN_BIT);
  }

  async getI2CMasterMode() {  
    return await this.#i2c.readBit(MPU9250_CONSTS.RA_USER_CTRL, MPU9250_CONSTS.USERCTRL_I2C_MST_EN_BIT);  
  }

  getPitch(value) {
    return ((Math.atan2(value[0], value[2]) + Math.PI) * (180 / Math.PI)) - 180;
  }

  getRoll(value) {
    return ((Math.atan2(value[1], value[2]) + Math.PI) * (180 / Math.PI)) - 180;
  }

  getYaw() {
    return 0;
  }

  async setClockSource(adrs) {  
    return await this.#i2c.writeBits(MPU9250_CONSTS.RA_PWR_MGMT_1, MPU9250_CONSTS.PWR1_CLKSEL_BIT, MPU9250_CONSTS.PWR1_CLKSEL_LENGTH, adrs);  
  }

  async setFullScaleGyroRange(adrs) {    
    this.gyroScalarInv = (this.#config.scaleValues) ? 1 / MPU9250_CONSTS.GYRO_SCALE_FACTOR[adrs] : 1;    
    return await this.#i2c.writeBits(MPU9250_CONSTS.RA_GYRO_CONFIG, MPU9250_CONSTS.GCONFIG_FS_SEL_BIT, MPU9250_CONSTS.GCONFIG_FS_SEL_LENGTH, adrs);  
  }

  async setFullScaleAccelRange(adrs) {  
    this.accelScalarInv = (this.#config.scaleValues) ? 1 / MPU9250_CONSTS.ACCEL_SCALE_FACTOR[adrs] : 1;
    return await this.#i2c.writeBits(MPU9250_CONSTS.RA_ACCEL_CONFIG_1, MPU9250_CONSTS.ACONFIG_FS_SEL_BIT, MPU9250_CONSTS.ACONFIG_FS_SEL_LENGTH, adrs);
  }

  async setSleepEnabled(bool) {
    const val = bool ? 1 : 0;    
    return await this.#i2c.writeBit(MPU9250_CONSTS.RA_PWR_MGMT_1, MPU9250_CONSTS.PWR1_SLEEP_BIT, val);  
  }

  async setI2CMasterModeEnabled(bool) {
    const val = bool ? 1 : 0;  
    return await this.#i2c.writeBit(MPU9250_CONSTS.RA_USER_CTRL, MPU9250_CONSTS.USERCTRL_I2C_MST_EN_BIT, val);
  }
  
  async setByPASSEnabled(bool) {
    const adrs = bool ? 1 : 0;    
    return await this.#i2c.writeBit(MPU9250_CONSTS.RA_INT_PIN_CFG, MPU9250_CONSTS.INTCFG_BYPASS_EN_BIT, adrs);    
  }

  async setDLPFConfig(dlpf_cfg) {  
    try {
      return await this.#i2c.writeBits(MPU9250_CONSTS.RA_CONFIG, 0, 3, dlpf_cfg)
    } catch (e) {
      this.#debug.Log('ERROR', 'setDLPFConfig ' + e.message);
    }    
  }
  
  async setAccelDLPFConfig(a_dlpf_cfg) {  
    try {
      return await this.#i2c.writeBits(MPU9250_CONSTS.RA_ACCEL_CONFIG_2, 0, 4, a_dlpf_cfg);
    } catch (e) {
      this.#debug.Log('ERROR', 'setAccelDLPFConfig ' + e.message);
    }    
  }

  async setSampleRate(sample_rate) {
    if (sample_rate < MPU9250_CONSTS.SAMPLERATE_MAX && sample_rate >= 8000) {
      sample_rate = 8000;
    }
    if (sample_rate < 8000 && sample_rate > 1000) {
      sample_rate = 1000;
    }
    if (sample_rate < 1000) {
      sample_rate = 1000 / (1 + sample_rate);
    }
    try {
      return await this.#i2c.writeBits(MPU9250_CONSTS.SMPLRT_DIV, 0, 8);
    } catch (e) {
      this.#debug.Log('ERROR', 'setSampleRate ' + e.message);
    }
  }

  async printSettings() {
    const CLK_RNG = [
      '0 (Internal 20MHz oscillator)',
      '1 (Auto selects the best available clock source)',
      '2 (Auto selects the best available clock source)',
      '3 (Auto selects the best available clock source)',
      '4 (Auto selects the best available clock source)',
      '5 (Auto selects the best available clock source)',
      '6 (Internal 20MHz oscillator)',
      '7 (Stops the clock and keeps timing generator in reset)'
    ];

    
    const idDevice = await this.getIDDevice();
    const bypassEnabled = await this.getByPASSEnabled();
    const sleepEnabled = await this.getSleepEnabled();
    const masterMode = await this.getI2CMasterMode();
    const clockSource = await this.getClockSource();
    const accelSettings = await this.getAccelPowerSettings();
    const gyroSettings = await this.getGyroPowerSettings();
    
    this.#debug.Log('INFO', 'MPU9250:');
    this.#debug.Log('INFO', '--> Device address: 0x' + this.#config.address.toString(16));
    this.#debug.Log('INFO', '--> i2c bus: 0x' + idDevice.toString(16));
    this.#debug.Log('INFO', '--> Device ID: 0x' + idDevice.toString(16));
    this.#debug.Log('INFO', '--> BYPASS enabled: ' + (bypassEnabled ? 'Yes' : 'No'));
    this.#debug.Log('INFO', '--> SleepEnabled Mode: ' + ( sleepEnabled === 1 ? 'On' : 'Off'));
    this.#debug.Log('INFO', '--> i2c Master Mode: ' + (masterMode === 1 ? 'Enabled' : 'Disabled'));
    this.#debug.Log('INFO', '--> Power Management (0x6B, 0x6C):');
    this.#debug.Log('INFO', '  --> Clock Source: ' + CLK_RNG[clockSource]);
    this.#debug.Log('INFO', '  --> Accel enabled (x, y, z): ' + this.#vectorToYesNo(accelSettings));
    this.#debug.Log('INFO', '  --> Gyro enabled (x, y, z): ' + this.#vectorToYesNo(gyroSettings));
  };
  
  #vectorToYesNo(v) {
    let str = '(';
      str += v[0] ? 'No, ' : 'Yes, ';
      str += v[1] ? 'No, ' : 'Yes, ';
      str += v[2] ? 'No' : 'Yes';
      str += ')';
    return str;
  }
  
  async printAccelSettings() {
    const FS_RANGE = ['±2g (0)', '±4g (1)', '±8g (2)', '±16g (3)'];
    const accelRange = await this.getFullScaleAccelRange();
    
    this.#debug.Log('INFO', 'Accelerometer:');
    this.#debug.Log('INFO', '--> Full Scale Range (0x1C): ' + FS_RANGE[accelRange]);
    this.#debug.Log('INFO', '--> Scalar: 1/' + (1 / this.accelScalarInv));
    this.#debug.Log('INFO', '--> Calibration:');
    this.#debug.Log('INFO', '  --> Offset: ');
    this.#debug.Log('INFO', '    --> x: ' + this.#config.accelCalibration.offset.x);
    this.#debug.Log('INFO', '    --> y: ' + this.#config.accelCalibration.offset.y);
    this.#debug.Log('INFO', '    --> z: ' + this.#config.accelCalibration.offset.z);
    this.#debug.Log('INFO', '  --> Scale: ');
    this.#debug.Log('INFO', '    --> x: ' + this.#config.accelCalibration.scale.x);
    this.#debug.Log('INFO', '    --> y: ' + this.#config.accelCalibration.scale.y);
    this.#debug.Log('INFO', '    --> z: ' + this.#config.accelCalibration.scale.z);
  }
  
  async printGyroSettings() {
    const gyroRange = await this.getFullScaleGyroRange()
    const FS_RANGE = ['+250dps (0)', '+500 dps (1)', '+1000 dps (2)', '+2000 dps (3)'];
    this.#debug.Log('INFO', 'Gyroscope:');
    this.#debug.Log('INFO', '--> Full Scale Range (0x1B): ' + FS_RANGE[gyroRange]);
    this.#debug.Log('INFO', '--> Scalar: 1/' + (1 / this.gyroScalarInv));
    this.#debug.Log('INFO', '--> Bias Offset:');
    this.#debug.Log('INFO', '  --> x: ' + this.#config.gyroBiasOffset.x);
    this.#debug.Log('INFO', '  --> y: ' + this.#config.gyroBiasOffset.y);
    this.#debug.Log('INFO', '  --> z: ' + this.#config.gyroBiasOffset.z);
  }
}

export default {
  MPU9250
}
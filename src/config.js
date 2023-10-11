import Arm from './arm/Arm.js'
import ArmPart from './arm/ArmPart.js';
import { LeverageX, LeverageY, LeverageZ, Claw } from './servo/leverages.js';

const ARM_SHOULDER_Y_PIN = 17;
const ARM_SHOULDER_Z_PIN = 4;
const ARM_ELBOW_Y_PIN = 18;
const ARM_WRIST_Y_PIN = 22;
const ARM_WRIST_Z_PIN = 27;
const ARM_CLAW_X_PIN = 23;
const ARM_CLAW_Y_PIN = 24;
const ARM_CLAW_PIN = 25;

const BASE_HEIGHT = 115;
const SHOULDER_Z_WIDTH = 115;
const SHOULDER_Y_WIDTH = 115;
const ELBOW_Y_WIDTH = 115;
const WRIST_Y_WIDTH = 115;
const WRIST_Z_WIDTH = 115;
const CLAW_Y_WIDTH = 115;
const CLAW_X_WIDTH = 10;
const CLAW_WIDTH = 100;

const shoulder = new ArmPart([
  new LeverageZ({ pin: ARM_SHOULDER_Z_PIN, width: SHOULDER_Z_WIDTH }),
  new LeverageY({ pin: ARM_SHOULDER_Y_PIN, width: SHOULDER_Y_WIDTH })
]);
const elbow = new ArmPart([
  new LeverageZ({ pin: ARM_ELBOW_Y_PIN, width: ELBOW_Y_WIDTH })
]);
const wrist = new ArmPart([
  new LeverageZ({ pin: ARM_WRIST_Z_PIN, width: WRIST_Z_WIDTH }),
  new LeverageY({ pin: ARM_WRIST_Y_PIN, width: WRIST_Y_WIDTH })
]);
const claw = new ArmPart([
  new LeverageY({ pin: ARM_CLAW_Y_PIN, width: CLAW_Y_WIDTH }),
  new LeverageX({ pin: ARM_CLAW_X_PIN, width: CLAW_X_WIDTH }),
  new Claw({ pin: ARM_CLAW_PIN, width: CLAW_WIDTH })
]);

export const arm = new Arm({
  parts: [ shoulder, elbow, wrist, claw ],
  height: BASE_HEIGHT
});

export const responseWarningTime = 100;
export const serverPort = 10111;

export default {
  responseWarningTime,
  arm,
  serverPort
}
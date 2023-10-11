import fs from 'fs/promises';

const devicePath = '/dev/pi-blaster';

const DEFAUL_FREQUENCY = 100;
const DEFAULT_CYCLE_LENGTH = DEFAUL_FREQUENCY / freq;


export async function write(commands) {
  let device;
  const buffer = Buffer.from(commands.join('; ') + "\n");
  try {
    device = await fs.open(devicePath, "w");
    fs.write(device, buffer, 0, buffer.length, -1);
  } finally {
      device ?? fs.close(device);
  }
}

export function pulseWidthToDuty(length) { 
  return length / DEFAULT_CYCLE_LENGTH; 
}

export default {
  pulseWidthToDuty,
  write
}
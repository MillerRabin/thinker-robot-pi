process.env.PATH += ':/usr/sbin'
import { MPU9250 } from './mpu9250.js';

async function getData(mpu) {
  try {
    const mt = await mpu.getMotion6();
    console.log(mt);
    setTimeout(() => {
      getData(mpu);
    }, 1000);
  } catch (e) {
    console.log(e);
  }
}


async function init() {
  const mpu = new MPU9250();
  console.log('initializing');
  await mpu.initialize();
  console.log('initialized');
  const temp = await mpu.getTemperatureCelsiusDigital();
  console.log(temp);
  getData(mpu);
}

setTimeout(() => {
  init();
}, 1000);

process.on('unhandledRejection', (err) => {
  console.log(err);
});
import { I2C } from 'raspi-i2c';
import { promisify } from 'node:util';

export default class LOCAL_I2C { 
  #i2c = new I2C();
  #addr;
  #readByteInternal = promisify(this.#i2c.readByte.bind(this.#i2c));
  #writeByteInternal = promisify(this.#i2c.writeByte.bind(this.#i2c));
  #readInternal = promisify(this.#i2c.read.bind(this.#i2c));
  #writeInternal = promisify(this.#i2c.write.bind(this.#i2c));

  async readByte(register) {
    return await this.#readByteInternal(this.#addr, register);
  }

  async writeByte(register, value) {
    return await this.#writeByteInternal(this.#addr, register, value);
  }

  async read(register, length) {
    return await this.#readInternal(this.#addr, register, length);
  }

  async write(register, buffer) {
    return await this.#writeInternal(this.#addr, register, buffer);
  }

  constructor(addr) {
    this.#addr = addr;
  }

  bitMask(bit, length) {
    return ((1 << length) - 1) << bit;
  }

    /**
      * Return the bit value, 1 or 0.
      * @param  {number}   register     The address of the byte to read.
      * @param  {number}   bit      The nth bit.
      * @return {number}            1 or 0.
    */
  async readBit(register, bit) {
    const buf = await this.#readByteInternal(this.#addr, register);
    return (buf >> bit) & 1;
  }

    /**
     * Write a sequence of bits.  Note, this will do a read to get the existing value, then a write.
     * @param  {number}   register     The address of the byte to write.
     * @param  {number}   bit      The nth bit to start at.
     * @param  {number}   length   The number of bits to change.
     * @param  {number}   value    The values to change.
   */
  async writeBits(register, bit, length, value) {
    const oldValue = await this.#readByteInternal(this.#addr, register);
    const mask = this.bitMask(bit, length);
    const newValue = oldValue ^ ((oldValue ^ (value << bit)) & mask);
    return await this.#writeByteInternal(this.#addr, register, newValue);
  }

    /**
     * Write one bit.  Note, this will do a read to get the existing value, then a write.
     * @param  {number}   register     The address of the byte to write.
     * @param  {number}   bit      The nth bit.
     * @param  {number}   value    The new value, 1 or 0.
   */
  async writeBit(register, bit, value) {
    return await this.writeBits(register, bit, 1, value);
  }
}








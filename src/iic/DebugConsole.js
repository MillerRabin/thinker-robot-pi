export default class DebugConsole {
  #enabled;

  constructor(enabled) {
    this.#enabled = enabled || false;
  }

  Log (type, str) {
    if (!this.#enabled) return;
    const date = new Date();
    console.log(`[${type.toUpperCase()} ${date.toLocaleString()}]: ${str}`);
  }

  get enabled() { return this.#enabled; } 

}

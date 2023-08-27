function init() {
  const test = 'hello world';
  console.log(test);
}

setTimeout(() => {
  init();
}, 20000);
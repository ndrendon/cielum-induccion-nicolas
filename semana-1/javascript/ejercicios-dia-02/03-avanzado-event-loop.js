console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

Promise.resolve()
  .then(() => console.log("C"))
  .then(() => console.log("D"));

setTimeout(() => {
  console.log("E");
  Promise.resolve().then(() => console.log("F"));
}, 0);

async function tarea() {
  console.log("G");
  await null;
  console.log("H");
}

tarea();

console.log("I");

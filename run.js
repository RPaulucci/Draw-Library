/** Loop recursive setTimeout */
export const run = (func, sp = 1) => {
  let end = true;
  if (func) end = func();
  if (end) return;
  setTimeout(() => {
    run(func, sp);
  }, sp);
};

/** loop recursive setInterval */
export const fastRun = (func, sp = 1) => {
  let end = true;
  if (func) end = func();
  if (end) return;
  setInterval(() => {
    run(func, sp);
  }, sp);
};

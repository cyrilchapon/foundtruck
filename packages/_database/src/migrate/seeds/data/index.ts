export const genX =
  <T>(generator: () => T) =>
  (x: number): T[] =>
    new Array(x).fill(null).map(() => generator())

// Polyfill for Symbol.asyncIterator (http://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-3.html)
(Symbol as any).asyncIterator = Symbol.asyncIterator || Symbol.for('Symbol.asyncIterator');

export async function sleep(ms: number) {
  return new Promise(((resolve) => {
    setTimeout(resolve, ms);
  }));
}

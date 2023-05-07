export const filterUndefined = <T>(x: T | undefined): x is T => x !== undefined;

export function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

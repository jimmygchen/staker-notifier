export const validatorShortName = (pubkey) => pubkey.slice(2, 9);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export async function withRetry(fn, options = {}) {
  const { maxAttempts = 5, interval = 3000 } = options;
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      return await fn();
    } catch (err) {
      attempts++;
      console.warn(`${attempts} of ${maxAttempts} attempts failed with error: ${err}`);

      if (attempts == maxAttempts) {
        throw new Error(`Failed after ${attempts} attempts: ${err}`);
      }

      await sleep(interval);
    }
  }
}
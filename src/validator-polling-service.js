import { validatorShortName, withRetry } from './utils.js';
import { logger } from './logger.js';

const PUBKEY_REGEX = /0x[A-Fa-f0-9]{96}/;
const SECONDS_PER_SLOT = 12;
const SLOTS_PER_EPOCH = 32;
const SECONDS_PER_EPOCH = SECONDS_PER_SLOT * SLOTS_PER_EPOCH;

class ValidatorPollingService {
  #pollingIntervalSeconds;
  #beaconApiClient;
  #validatorPubKeys = [];
  #listeners = [];
  #genesisTime;

  constructor(beaconApiClient, pollingIntervalSeconds = SECONDS_PER_EPOCH) {
    this.#beaconApiClient = beaconApiClient;
    this.#pollingIntervalSeconds = pollingIntervalSeconds;
  }

  addValidators(pubKeys) {
    const newPubKeys = [].concat(pubKeys);

    const allValid = newPubKeys.every(key => {
      const valid = PUBKEY_REGEX.test(key);
      if (!valid) {
        logger.error(`Invalid validator key: ${key}`)
      }
      return valid;
    });

    if (!allValid) throw new Error(`Failed to add validator key(s)`)

    this.#validatorPubKeys = this.#validatorPubKeys.concat(newPubKeys);

    logger.info(`Validator(s) added: ${newPubKeys.map(k => validatorShortName(k)).join(',')}`)
  }

  /**
   * A callback to be called when validator data is returned.
   * 
   * @callback validatorResultCallback
   * @param {Object[]} validators
   * @param {Object} validators.previous validator state at previous epoch. `undefined` if validator is just added in the current epoch.
   * @param {Object} validators.current validator state at current epooch
   */

  /**
   * add a listener to be called when validator data is returned.
   * 
   * @param {validatorResultCallback} listener 
   */
  addListener(listener) {
    if (typeof listener == 'function') {
      this.#listeners.push(listener);
    } else {
      throw new Error('listener must be a function')
    }
  }

  start() {
    setInterval(this.#pollValidators.bind(this), this.#pollingIntervalSeconds * 1000);
    logger.info(`Started polling validators every ${this.#pollingIntervalSeconds} seconds.`)
  }

  async #pollValidators() {
    if (!this.#genesisTime) {
      this.#genesisTime = await this.#beaconApiClient.getGenesisTime();
    }

    const queryValidatorStates = () => {
      const currentSlot = Math.floor((new Date().getTime() / 1000 - this.#genesisTime) / SECONDS_PER_SLOT) - 1;
      const previousEpochSlot = currentSlot - SLOTS_PER_EPOCH;

      return Promise.all([
        this.#beaconApiClient.getValidators(currentSlot, this.#validatorPubKeys),
        this.#beaconApiClient.getValidators(previousEpochSlot, this.#validatorPubKeys),
      ]);
    };

    const [currentEpochData, previousEpochData] = await withRetry(queryValidatorStates, { interval: SECONDS_PER_EPOCH });

    const validatorStates = mergeValidatorData(currentEpochData.data, previousEpochData.data)
    this.#listeners.forEach(listener => listener(validatorStates));
  }

}

function mergeValidatorData(currentList, previousList) {
  const merged = {};
  currentList.forEach(validator => merged[validator.index] = { current: validator });
  previousList.forEach(validator => merged[validator.index] = { ...merged[validator.index], previous: validator });
  return Object.values(merged);
}

export { ValidatorPollingService, SECONDS_PER_EPOCH, mergeValidatorData };

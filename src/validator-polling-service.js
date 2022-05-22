const PUBKEY_REGEX = /0x[A-Fa-f0-9]{96}/;
const SECONDS_PER_SLOT = 12;
const SLOTS_PER_EPOCH = 32;
const SECONDS_PER_EPOCH = SECONDS_PER_SLOT * SLOTS_PER_EPOCH;


class ValidatorPollingService {
    #pollingIntervalSeconds = SECONDS_PER_EPOCH;
    #beaconApiClient;
    #validatorPubKeys = [];
    #listeners = [];
    #genesisTime;

    constructor(beaconApiClient) {
        this.#beaconApiClient = beaconApiClient;
    }

    addValidators(pubKeys) {
        const newPubKeys = [].concat(pubKeys);

        const allValid = newPubKeys.every(key => {
            const valid = PUBKEY_REGEX.test(key);
            if (!valid) {
                console.error(`Invalid validator key: ${key}`)
            }
            return valid;
        });

        if (!allValid) throw new Error(`Failed to add validator key(s)`)

        this.#validatorPubKeys = this.#validatorPubKeys.concat(newPubKeys);
    }

    /**
     * A callback to be called when validator data is returned.
     * 
     * @callback validatorResultCallback
     * @param {Object[]} validators
     * @param {Object} previousState
     * @param {Object} currentState
     */

    /**
     * add a listener to be called when validator data is returned.
     * 
     * @param {function} listener 
     */
    addListener(listener) {
        if (typeof listener == 'function') {
            this.#listeners.push(listener);
        } else {
            throw new Error('listener must be a function')
        }
    }

    start() {
        setInterval(this.pollValidators.bind(this), this.#pollingIntervalSeconds * 1000)
    }

    async pollValidators() {
        if (!this.#genesisTime) {
            this.#genesisTime = await this.#beaconApiClient.getGenesisTime();
        }

        const currentSlot = Math.floor((new Date().getTime() / 1000 - this.#genesisTime) / SECONDS_PER_SLOT);
        const previousEpochSlot = currentSlot - SLOTS_PER_EPOCH;
        
        const [currentData, previousEpochData] = await Promise.all([
            this.#beaconApiClient.getValidators(currentSlot, this.#validatorPubKeys),
            this.#beaconApiClient.getValidators(previousEpochSlot, this.#validatorPubKeys),
        ]);

        this.#listeners.forEach(listener => listener(currentData, previousEpochData));
    }


}

module.exports = { ValidatorPollingService, SECONDS_PER_EPOCH };
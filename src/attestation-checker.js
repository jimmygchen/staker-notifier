const { BeaconAPIClient } = require("./beacon-api-client");

class AttestationChecker {
    constructor(config, notifier) {
        this.pollIntervalSeconds = config.pollIntervalSeconds;
        this.notifier = notifier;
        this.apiClient = new BeaconAPIClient(config.beaconAPIs)
    }

    start(pubkeys) {
        console.log(`Polling every ${this.pollIntervalSeconds} seconds`)
        // setInterval(this.checkAttestations.bind(this), this.pollIntervalSeconds * 1000)
        setInterval(this.checkAttestations.bind(this, pubkeys), 2 * 1000)
    }

    async checkAttestations(pubkeys) {
        let isBalanceReduced = {}

        try {
            isBalanceReduced = await this.apiClient.isBalanceReduced(pubkeys)
            console.log({isBalanceReduced})
        } catch (err) {
            console.error(`error retrieving assigmnets: ${err}`)
        }
    }
}

module.exports = { AttestationChecker }
const { BeaconAPIClient } = require("./beacon-api-client");
const { notifier } = require("./sms-notifier")

class AttestationChecker {
    constructor(config, notifier) {
        this.pollIntervalSeconds = config.pollIntervalSeconds;
        this.notifier = notifier;
        this.apiClient = new BeaconAPIClient(config.beaconAPIs)
    }

    start(pubkeys) {
        console.log(`Polling every ${this.pollIntervalSeconds} seconds`)
        // setInterval(this.checkAttestations.bind(this), this.pollIntervalSeconds * 1000)
        setInterval(this.checkAttestations.bind(this, pubkeys), 4 * 1000)
    }

    async checkAttestations(pubkeys) {
        let isBalanceReduced = {}

        try {
            isBalanceReduced = await this.apiClient.isBalanceReduced(pubkeys)
            if (isBalanceReduced) {
                this.notifier.notify(`Balance for validator ${pubkeys} has reduced!!!!`)
            }
        } catch (err) {
            console.error(`error retrieving staff: ${err}`)
        }
    }
}

module.exports = { AttestationChecker }
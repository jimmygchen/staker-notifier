const { BeaconAPIClient } = require("./beacon-api-client");

class ValidatorBalanceChecker {
    constructor(config, notifier) {
        this.pollIntervalSeconds = config.pollIntervalSeconds;
        this.notifier = notifier;
        this.apiClient = new BeaconAPIClient(config.beaconAPIs)
    }

    start(pubkeys) {
        console.log(`Polling Beacon API every ${this.pollIntervalSeconds} seconds`)
        setInterval(this.checkBalances.bind(this, pubkeys), this.pollIntervalSeconds * 1000)
    }

    async checkBalances(pubkeys) {
        try {
            const isBalanceReduced = await this.apiClient.isBalanceReduced(pubkeys)
            if (isBalanceReduced) {
                this.notifier.notify(`Balance for validator ${pubkeys} has reduced at ${new Date().toUTCString()}`)
            }
        } catch (err) {
            console.error(`error retrieving balance: ${err}`)
        }
    }
}

module.exports = { ValidatorBalanceChecker }
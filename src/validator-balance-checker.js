const { BeaconAPIClient } = require("./beacon-api-client");

class ValidatorBalanceChecker {
    constructor(config, notifier) {
        this.pollIntervalSeconds = config.pollIntervalSeconds;
        this.notifier = notifier;
        this.apiClient = new BeaconAPIClient(config.beaconAPIs)
    }

    start(pubkeys) {
        console.log(`Polling Beacon API for ${pubkeys.length} validators every ${this.pollIntervalSeconds} seconds`)
        setInterval(this.checkBalances.bind(this, pubkeys), this.pollIntervalSeconds * 1000)
    }

    checkBalances(pubkeys) {
        pubkeys.forEach(async (pubkey) => {
            try {
                const isBalanceReduced = await this.apiClient.isBalanceReduced(pubkey)
                if (isBalanceReduced) {
                    this.notifier.notify(`Balance for validator ${pubkey} has reduced at ${new Date().toUTCString()}`)
                }
            } catch (err) {
                console.error(`error retrieving balance for validator ${pubkey}: ${err}`)
            }
        });
    }
}

module.exports = { ValidatorBalanceChecker }
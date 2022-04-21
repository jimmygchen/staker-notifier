const { BeaconAPIClient } = require("./beacon-api-client");

class AttestationChecker {
    constructor(config, notifier) {
        this.pollIntervalSeconds = config.pollIntervalSeconds;
        this.notifier = notifier;
        this.apiClient = new BeaconAPIClient(config.beaconAPIs)
    }

    start() {
        console.log(`Polling every ${this.pollIntervalSeconds} seconds`)
        // setInterval(this.checkAttestations.bind(this), this.pollIntervalSeconds * 1000)
        setInterval(this.checkAttestations.bind(this), 2 * 1000)
    }

    async checkAttestations() {
        const assignments = await this.apiClient.getEpochAssignments()

        // check
        // post notifiers
        console.log({assignments})
        console.log(`Got ${assignments.length} assignments`)   
    }
}

module.exports = { AttestationChecker }
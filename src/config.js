const config = {
    attestationChecker: {
        beaconAPIs: process.env.BEACON_API_LIST,
        pollIntervalSeconds: 12
    },
    sms: {
        apiKey: ''
    }
}

module.exports = { config }
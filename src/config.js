const config = {
    attestationChecker: {
        beaconAPIs: process.env.BEACON_API_LIST,
        pollIntervalSeconds: 384 // 1 epoch
    },
    sms: {
        apiKey: ''
    }
}

module.exports = { config }
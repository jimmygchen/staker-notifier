const config = {
    attestationChecker: {
        beaconAPIs: process.env.BEACON_API_LIST,
        pollIntervalSeconds: 10 // 384 = 1 epoch
    },
    sms: {
        apiKey: ''
    },
    pubkeys: ['0x800014888ffca98e593fc94eea7a67e12193b8545046661894c2e22127c511359329a1e3d8ffae887853bdd4800efc61']
}

module.exports = { config }
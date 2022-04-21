const config = {
    attestationChecker: {
        beaconAPIs: process.env.BEACON_API_LIST,
        pollIntervalSeconds: 30 // 384 = 1 epoch
    },
    sms: {
        apiKey: ''
    },
    pubkeys: ['0xa18f6c9ece449c9fbdd565db964a21e0114ed73c37e52528d144a466e07473d697dd618924ced9e1231449a0f70749a3']
}

module.exports = { config }

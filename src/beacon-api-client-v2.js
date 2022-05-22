const axios = require('axios')

class BeaconAPIClientV2 {
    constructor(beaconAPIs) {
        this.beaconAPIs = beaconAPIs && beaconAPIs.split(',');
        this.http = axios.create({
            baseURL: this.beaconAPIs[0]
        })
    }

    async getValidators(stateId, pubKeys) {
        const { data } = await this.getBeaconData(`/eth/v1/beacon/states/${stateId}/validators?id=${pubKeys.join(',')}`)
        return data;
    }

    async getBeaconData(url) {
        try {
            const data = await this.http.get(url)
            return data
        } catch (err) {
            console.log(`Request to ${url} failed with error ${err.message}`)
            throw err
        }
    }

    async getGenesisTime() {
        if (!this.genesisTime) {
            const { data: genesisResp } = await this.getBeaconData(`/eth/v1/beacon/genesis`);
            this.genesisTime = genesisResp.data.genesis_time;
            console.debug(`Genesis time for network is ${this.genesisTime}`);
        }
        return this.genesisTime;
    }
}

module.exports = BeaconAPIClientV2;

const axios = require('axios')

class BeaconAPIClient {
    constructor(beaconAPIs) {
        this.beaconAPIs = beaconAPIs && beaconAPIs.split(',');
        this.http = axios.create({
            baseURL: this.beaconAPIs[0]
        })
    }

    async isBalanceReduced(pubkey) {
        const genesisTime = await this.getGenesisTime();

        const currentSlot = Math.floor((new Date().getTime() / 1000 - genesisTime) / 12)
        const { data: currentEpochResp } = await this.getBeaconData(`/eth/v1/beacon/states/${currentSlot}/validators?id=${pubkey}`)
        const currentEpochBalance = currentEpochResp.data[0].balance
        console.debug("Current balance: " + currentEpochBalance)

        const previousEpochSlot = currentSlot - 32
        const { data: previousEpochResp } = await this.getBeaconData(`/eth/v1/beacon/states/${previousEpochSlot}/validators?id=${pubkey}`)
        const previousBalance = previousEpochResp.data[0].balance
        console.debug("Previous balance: " + previousBalance)

        return (Number(currentEpochBalance) <= Number(previousBalance))
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

module.exports = { BeaconAPIClient };

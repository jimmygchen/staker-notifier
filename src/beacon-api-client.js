import axios from 'axios';
import qs from 'qs';

class BeaconAPIClient {
  constructor(beaconAPIs) {
    this.beaconAPIs = beaconAPIs && beaconAPIs.split(',');
    this.http = axios.create({
      baseURL: this.beaconAPIs[0]
    })
  }

  async getValidators(stateId, pubKeys) {
	  const options = {
		  params: { id: pubKeys },
		  paramsSerializer: (params) => {
		         return qs.stringify(params, {arrayFormat: 'repeat'})
		      }
	  };
	  
    const { data } = await this.queryEndpoint(`/eth/v1/beacon/states/${stateId}/validators`, options)
    return data;
  }

  async queryEndpoint(url, options = {}) {
    try {
      const data = await this.http.get(url, options)
      return data
    } catch (err) {
      console.log(`Request to ${url} failed with error ${err.message}`)
      throw err
    }
  }

  async getGenesisTime() {
    if (!this.genesisTime) {
      const { data: genesisResp } = await this.queryEndpoint(`/eth/v1/beacon/genesis`);
      this.genesisTime = genesisResp.data.genesis_time;
      console.debug(`Genesis time for network is ${this.genesisTime}`);
    }
    return this.genesisTime;
  }
}

export { BeaconAPIClient };

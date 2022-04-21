const axios = require('axios')

const PRATER_GENESIS_TS = 1616508000

class BeaconAPIClient {
    constructor(beaconAPIs) {
        this.beaconAPIs = beaconAPIs && beaconAPIs.split(',');
        this.http = axios.create({
            baseURL: this.beaconAPIs[0]
        })
    }

    async isBalanceReduced(pubkey) {
        const currentSlot = Math.floor((new Date().getTime() / 1000 - PRATER_GENESIS_TS) / 12)
        const {data: currentEpochResp } = await this.http.get(`/eth/v1/beacon/states/${currentSlot}/validators?id=${pubkey}`)
        const currentEpochBalance = currentEpochResp.data.balance
        
        const previousEpochSlot = currentSlot - 32
        const {data: previousEpochResp} = await this.http.get(`/eth/v1/beacon/states/${previousEpochSlot}/validators?id=${pubkey}`)
        const previousBalance = previousEpochResp.data.balance

        return (currentEpochBalance <= previousBalance) 
    }

    // async getAsttestationData () {
        
    //     for (let index = 0; index < 32; index++) {
    //         const slot = this.currentEpochStartSlot + index
    //         const { data: committee } = await this.http.get(`/eth/v1/beacon/states/${slot}/committees`)
    //     }
        
    //     // get committee 
    //     // get block
    // }

    // // https://beaconcha.in/validator/247040/history?draw=1&columns%5B0%5D%5Bdata%5D=0&columns%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5Borderable%5D=false&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B1%5D%5Bdata%5D=1&columns%5B1%5D%5Bname%5D=&columns%5B1%5D%5Bsearchable%5D=true&columns%5B1%5D%5Borderable%5D=false&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B2%5D%5Bdata%5D=2&columns%5B2%5D%5Bname%5D=&columns%5B2%5D%5Bsearchable%5D=true&columns%5B2%5D%5Borderable%5D=false&columns%5B2%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B2%5D%5Bsearch%5D%5Bregex%5D=false&start=0&length=10&search%5Bvalue%5D=&search%5Bregex%5D=false&_=1650543544179
    // async getEpochAssignments() {
    //     const epoch = this.currentEpoch
    //     const {data: proposerResp} = await this.http.get(`/eth/v1/validator/duties/proposer/${epoch}`)
    //     // console.log(`proposerResp: ${JSON.stringify(proposerResp, null, 2)}`)
    //     // 0xa1400fd0735e035ea2620e4fe648c2313a0115c086c5cfe4829e9f25d4b71886
    //     const {data: headerResp} = await this.http.get(`/eth/v1/beacon/headers/${proposerResp.dependent_root}`)
    //     // console.log(`headerResp: ${JSON.stringify(headerResp, null, 2)}`)

    //     const depStateRoot = headerResp.data.header.message.state_root
    //     const {data: committeesResp} = await this.http.get(`/eth/v1/beacon/states/${depStateRoot}/committees?epoch=${epoch}`)
    //     // console.log(`committeesResp: ${JSON.stringify(committeesResp, null, 2)}`)

    //     const assignments = {
    //         proposerAssginments: {},
    //         attestorAssignments: {},
    //         syncAssignments: {}
    //     }

    //     // propose
    //     proposerResp.data.forEach(duty => {
    //         assignments.proposerAssginments[duty.slot] = duty.validator_index
    //     })

    //     // attest
    //     committeesResp.data.forEach(committee => {
    //         committee.validators.forEach((validatorIndex, index) => {
    //             const key = formatAttestorAssignmentKey(committee.slot, committee.index, index)
    //             assignments.attestorAssignments[key] = validatorIndex
    //         })
    //     })
	
    //     const syncCommitteeState = depStateRoot
    //     const {data: syncCommittee} = await this.http.get(`/eth/v1/beacon/states/${syncCommitteeState}/sync_committees?epoch=${epoch}`)
    //     assignments.syncAssignments = syncCommittee.validators;

    //     console.log(`assignments: ${JSON.stringify(assignments, null, 2)}`)
    //     return assignments;
	// // if epoch >= utils.Config.Chain.AltairForkEpoch {
	// // 	syncCommitteeState := depStateRoot
	// // 	if epoch == utils.Config.Chain.AltairForkEpoch {
	// // 		syncCommitteeState = fmt.Sprintf("%d", utils.Config.Chain.AltairForkEpoch*utils.Config.Chain.SlotsPerEpoch)
	// // 	}
	// // 	parsedSyncCommittees, err := lc.GetSyncCommittee(syncCommitteeState, epoch)
	// // 	if err != nil {
	// // 		return nil, err
	// // 	}
	// // 	assignments.SyncAssignments = make([]uint64, len(parsedSyncCommittees.Validators))

	// // 	// sync
	// // 	for i, valIndexStr := range parsedSyncCommittees.Validators {
	// // 		valIndexU64, err := strconv.ParseUint(valIndexStr, 10, 64)
	// // 		if err != nil {
	// // 			return nil, fmt.Errorf("in sync_committee for epoch %d validator %d has bad validator index: %q", epoch, i, valIndexStr)
	// // 		}
	// // 		assignments.SyncAssignments[i] = valIndexU64
	// // 	}
	// // }

	// // if len(assignments.AttestorAssignments) > 0 && len(assignments.ProposerAssignments) > 0 {
	// // 	lc.assignmentsCache.Add(epoch, assignments)
	// // }

	// // return assignments, nil
    // }
}

// function formatAttestorAssignmentKey(attestorSlot, committeeIndex, memberIndex) {
//     return `${attestorSlot}-${committeeIndex}-${memberIndex}`
// }

module.exports = { BeaconAPIClient };
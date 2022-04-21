const axios = require('axios')

class BeaconAPIClient {
    constructor(beaconAPIs) {
        this.beaconAPIs = beaconAPIs && beaconAPIs.split(',');
        this.http = axios.create({
            baseURL: this.beaconAPIs[0]
        })
        // TODO query from head
        this.currentEpoch = 88627
    }

    async getEpochAssignments() {
        const epoch = this.currentEpoch
        const {data: proposerResp} = await this.http.get(`/eth/v1/validator/duties/proposer/${epoch}`)
        console.log(`proposerResp: ${JSON.stringify(proposerResp, null, 2)}`)
        // 0xa1400fd0735e035ea2620e4fe648c2313a0115c086c5cfe4829e9f25d4b71886
        const {data: headerResp} = await this.http.get(`/eth/v1/beacon/headers/${proposerResp.dependent_root}`)
        console.log(`headerResp: ${JSON.stringify(headerResp, null, 2)}`)

        const depStateRoot = headerResp.data.header.message.state_root
        const {data: committeesResp} = await this.http.get(`/eth/v1/beacon/states/${depStateRoot}/committees?epoch=${epoch}`)
        console.log(`committeesResp: ${JSON.stringify(committeesResp, null, 2)}`)

        const assignments = {
            proposerAssginments: {},
            attestorAssignments: {},
            syncAssignments: {}
        }

        // propose
        proposerResp.data.forEach(duty => {
            assignments.proposerAssginments[duty.slot] = duty.validator_index
        })

        // attest
        committeesResp.data.forEach(committee => {
            committee.validators.forEach((validatorIndex, index) => {
                const key = formatAttestorAssignmentKey(committee.slot, committee.index, index)
                assignments.attestorAssignments[key] = validatorIndex
            })
        })
	
        const syncCommitteeState = depStateRoot
        const {data: syncCommittee} = await this.http.get(`/eth/v1/beacon/states/${syncCommitteeState}/sync_committees?epoch=${epoch}`)
        assignments.syncAssignments = syncCommittee.validators;

        return assignments;
	// if epoch >= utils.Config.Chain.AltairForkEpoch {
	// 	syncCommitteeState := depStateRoot
	// 	if epoch == utils.Config.Chain.AltairForkEpoch {
	// 		syncCommitteeState = fmt.Sprintf("%d", utils.Config.Chain.AltairForkEpoch*utils.Config.Chain.SlotsPerEpoch)
	// 	}
	// 	parsedSyncCommittees, err := lc.GetSyncCommittee(syncCommitteeState, epoch)
	// 	if err != nil {
	// 		return nil, err
	// 	}
	// 	assignments.SyncAssignments = make([]uint64, len(parsedSyncCommittees.Validators))

	// 	// sync
	// 	for i, valIndexStr := range parsedSyncCommittees.Validators {
	// 		valIndexU64, err := strconv.ParseUint(valIndexStr, 10, 64)
	// 		if err != nil {
	// 			return nil, fmt.Errorf("in sync_committee for epoch %d validator %d has bad validator index: %q", epoch, i, valIndexStr)
	// 		}
	// 		assignments.SyncAssignments[i] = valIndexU64
	// 	}
	// }

	// if len(assignments.AttestorAssignments) > 0 && len(assignments.ProposerAssignments) > 0 {
	// 	lc.assignmentsCache.Add(epoch, assignments)
	// }

	// return assignments, nil
    }
}

function formatAttestorAssignmentKey(attestorSlot, committeeIndex, memberIndex) {
    return `${attestorSlot}-${committeeIndex}-${memberIndex}`
}

module.exports = { BeaconAPIClient };



	// proposerResp, err := lc.get(fmt.Sprintf("%s/eth/v1/validator/duties/proposer/%d", lc.endpoint, epoch))
	// if err != nil {
	// 	return nil, fmt.Errorf("error retrieving proposer duties: %v", err)
	// }
	// var parsedProposerResponse StandardProposerDutiesResponse
	// err = json.Unmarshal(proposerResp, &parsedProposerResponse)
	// if err != nil {
	// 	return nil, fmt.Errorf("error parsing proposer duties: %v", err)
	// }

	// // fetch the block root that the proposer data is dependent on
	// headerResp, err := lc.get(fmt.Sprintf("%s/eth/v1/beacon/headers/%s", lc.endpoint, parsedProposerResponse.DependentRoot))
	// if err != nil {
	// 	return nil, fmt.Errorf("error retrieving chain header: %v", err)
	// }
	// var parsedHeader StandardBeaconHeaderResponse
	// err = json.Unmarshal(headerResp, &parsedHeader)
	// if err != nil {
	// 	return nil, fmt.Errorf("error parsing chain header: %v", err)
	// }
	// depStateRoot := parsedHeader.Data.Header.Message.StateRoot


	// // Now use the state root to make a consistent committee query
	// committeesResp, err := lc.get(fmt.Sprintf("%s/eth/v1/beacon/states/%s/committees?epoch=%d", lc.endpoint, depStateRoot, epoch))
	// if err != nil {
	// 	return nil, fmt.Errorf("error retrieving committees data: %w", err)
	// }
	// var parsedCommittees StandardCommitteesResponse
	// err = json.Unmarshal(committeesResp, &parsedCommittees)
	// if err != nil {
	// 	return nil, fmt.Errorf("error parsing committees data: %w", err)
	// }


	// assignments := &types.EpochAssignments{
	// 	ProposerAssignments: make(map[uint64]uint64),
	// 	AttestorAssignments: make(map[string]uint64),
	// }

    // // propose
	// for _, duty := range parsedProposerResponse.Data {
	// 	assignments.ProposerAssignments[uint64(duty.Slot)] = uint64(duty.ValidatorIndex)
	// }

    // // attest
	// for _, committee := range parsedCommittees.Data {
	// 	for i, valIndex := range committee.Validators {
	// 		valIndexU64, err := strconv.ParseUint(valIndex, 10, 64)
	// 		if err != nil {
	// 			return nil, fmt.Errorf("epoch %d committee %d index %d has bad validator index %q", epoch, committee.Index, i, valIndex)
	// 		}
	// 		k := utils.FormatAttestorAssignmentKey(uint64(committee.Slot), uint64(committee.Index), uint64(i))
	// 		assignments.AttestorAssignments[k] = valIndexU64
	// 	}
	// }
const assert = require('assert');
const { ValidatorPollingService, SECONDS_PER_EPOCH } = require('../src/validator-polling-service');
const BeaconAPIClientV2 = require('../src/beacon-api-client-v2');

jest.useFakeTimers();
jest.mock('../src/beacon-api-client-v2');

describe('ValidatorPollingService', () => {
    let svc;
    let beaconApiClient;

    beforeEach(() => {
        beaconApiClient = new BeaconAPIClientV2();
        svc = new ValidatorPollingService(beaconApiClient);
    });

    it('should allow adding listener functions', () => {
        svc.addListener(() => 'I hear you!')
    });

    it.only('should poll beaconApiClient every epoch', () => {
        const getValidatorsMock = jest.spyOn(BeaconAPIClientV2.prototype, 'getValidators');
        
        svc.start();
        expect(getValidatorsMock).not.toBeCalled();

        jest.advanceTimersByTime(SECONDS_PER_EPOCH * 1000);
        expect(getValidatorsMock).toBeCalled();
        expect(getValidatorsMock).toHaveBeenCalledTimes(1);
    });

    describe('adding validators', () => {
        it('should NOT allow adding invalid pub keys', () => {
            expect(() => svc.addValidators('0x1')).toThrow();
        })

        it('should allow adding valid pub keys', () => {
            const validKey = '0x93bc240966f54a4d11fff8ac148d2ff131fb59f00fa1f510bc6e685f034917b559b6a8fff19a71a6e71b510fe33bf40c';
            expect(() => svc.addValidators(validKey)).not.toThrow();
        })
    });

    
});
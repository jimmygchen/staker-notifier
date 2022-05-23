import { ValidatorPollingService, SECONDS_PER_EPOCH, mergeValidatorData } from '../src/validator-polling-service.js';
import { BeaconAPIClient } from '../src/beacon-api-client.js';
import { jest } from '@jest/globals';

jest.useFakeTimers();

const flushPromises = () => Promise.resolve();

describe('ValidatorPollingService', () => {
  let svc;
  let beaconApiClient;

  beforeEach(() => {
    beaconApiClient = new BeaconAPIClient('http://localhost:5052');
    svc = new ValidatorPollingService(beaconApiClient);
    jest.spyOn(BeaconAPIClient.prototype, 'getGenesisTime').mockImplementation(() => Promise.resolve());
  });

  it('should allow adding listener functions', () => {
    svc.addListener(() => 'I hear you!')
  });

  it('should poll beaconApiClient every epoch', async () => {
    const getValidatorsMock = jest.spyOn(BeaconAPIClient.prototype, 'getValidators').mockImplementation(() => Promise.resolve({ data: [] }));

    svc.start();
    expect(getValidatorsMock).not.toBeCalled();

    jest.advanceTimersByTime(SECONDS_PER_EPOCH * 1000);
    await flushPromises();

    expect(getValidatorsMock).toBeCalled();
    expect(getValidatorsMock).toHaveBeenCalledTimes(2);
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

describe('mergeValidatorData', () => {
  it('should merge two validator lists (current & previous epochs) into a single list', () => {
    const validatorIndex = '1';

    const currentEpochData = [
      {
        "index": validatorIndex,
        "balance": "2",
        "status": "active_ongoing",
        "validator": {
          "pubkey": "0x93247f2209abcacf57b75a51dafae777f9dd38bc7053d1af526f220a7489a6d3a2753e5f3e8b1cfe39b56f43611df74a",
          "withdrawal_credentials": "0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2",
          "effective_balance": "1",
          "slashed": false,
          "activation_eligibility_epoch": "1",
          "activation_epoch": "1",
          "exit_epoch": "1",
          "withdrawable_epoch": "1"
        }
      }
    ];

    const previousEpochData = [{
      "index": validatorIndex,
      "balance": "1",
      "status": "active_ongoing",
      "validator": {
        "pubkey": "0x93247f2209abcacf57b75a51dafae777f9dd38bc7053d1af526f220a7489a6d3a2753e5f3e8b1cfe39b56f43611df74a",
        "withdrawal_credentials": "0xcf8e0d4e9587369b2301d0790347320302cc0943d5a1884560367e8208d920f2",
        "effective_balance": "1",
        "slashed": false,
        "activation_eligibility_epoch": "1",
        "activation_epoch": "1",
        "exit_epoch": "1",
        "withdrawable_epoch": "1"
      }
    }];

    const merged = mergeValidatorData(currentEpochData, previousEpochData);
    expect(merged.length).toEqual(1);
    expect(merged[0].current).toEqual(currentEpochData[0]);
    expect(merged[0].previous).toEqual(previousEpochData[0]);
  });

});
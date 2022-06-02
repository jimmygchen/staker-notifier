

import { jest } from '@jest/globals';
import { validatorStatusChangedAlert } from '../../src/alerts/validator-status-changed-alert';
import { newValidatorState } from '../test-utils/validator-state-factory';

describe('validatorStatusChangedAlert', () => {
  let notifierMock;
  let listener;

  beforeEach(() => {
    notifierMock = {
      notify: jest.fn()
    }

    listener = validatorStatusChangedAlert(notifierMock)
  });

  it('should NOT notify when validator status has not changed since last epoch', () => {
    const validatorState = newValidatorState();

    listener([{
      previous: validatorState,
      current: validatorState
    }]);

    expect(notifierMock.notify).not.toBeCalled();
  });

  it('should notify when validator status has changed since last epoch', () => {
    const validatorState = newValidatorState();
    const previousState = { ...validatorState, status: 'pending_queued' }

    listener([{
      previous: previousState,
      current: validatorState
    }]);

    expect(notifierMock.notify).toBeCalledWith(
      expect.stringMatching(
        `Validator ${validatorState.index} has transitioned from pending_queued to active_ongoing.`
      )
    )
  });

  it('should notify when validator has been added to the beacon chain, i.e. validator not in previous epoch', () => {
    const validatorState = { ...newValidatorState(), status: 'pending_queued' };

    listener([{
      current: validatorState
    }]);

    expect(notifierMock.notify).toBeCalledWith(
      expect.stringMatching(
        `Validator ${validatorState.index} has transitioned from unknown to pending_queued.`
      )
    )
  });
});

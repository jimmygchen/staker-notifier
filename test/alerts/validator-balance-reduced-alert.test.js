

import { jest } from '@jest/globals';
import { validatorBalanceReducedAlert } from '../../src/alerts/validator-balance-reduced-alert';
import { newValidatorState } from '../test-utils/validator-state-factory';

describe('validatorBalanceReducedAlert', () => {
  const MIN_EPOCHS_TO_TRIGGER = 3;
  const alertConfig = {
    minEpochsToTrigger: MIN_EPOCHS_TO_TRIGGER
  };

  let alert;
  let notifierMock;

  beforeEach(() => {
    notifierMock = {
      notify: jest.fn()
    };

    alert = validatorBalanceReducedAlert(notifierMock, alertConfig)
  });

  it('should NOT notify when validator does NOT have a previous state', () => {
    const validatorState = newValidatorState();

    alert([{ current: validatorState }]);

    expect(notifierMock.notify).not.toBeCalled();
  });

  it('should NOT notify when validator balance has increased from previous state', () => {
    const validatorState = newValidatorState();
    const newBalance = Number(validatorState.balance) + 1;

    alert([{
      current: { ...validatorState, balance: newBalance.toString() },
      previous: validatorState
    }]);

    expect(notifierMock.notify).not.toBeCalled();
  });

  it('should NOT notify when validator balance has reduced from previous state for less than {MIN_EPOCHS_TO_TRIGGER} epochs', () => {
    let validatorState = newValidatorState();

    for (let i = 0; i < MIN_EPOCHS_TO_TRIGGER - 1; i++) {
      const newBalance = Number(validatorState.balance) - 1;
      const previous = validatorState;
      const current = { ...previous, balance: newBalance.toString() }

      alert([{ previous, current }]);
      expect(notifierMock.notify).not.toBeCalled();

      validatorState = current;
    }
  });

  it('should notify when validator balance has reduced from previous state for {MIN_EPOCHS_TO_TRIGGER} epochs', () => {
    let validatorState = newValidatorState();

    for (let i = 0; i < MIN_EPOCHS_TO_TRIGGER; i++) {
      const newBalance = Number(validatorState.balance) - 1;
      const previous = validatorState;
      const current = { ...previous, balance: newBalance.toString() }
      alert([{ previous, current }]);
      validatorState = current;
    }

    expect(notifierMock.notify).toBeCalled();
  });

});

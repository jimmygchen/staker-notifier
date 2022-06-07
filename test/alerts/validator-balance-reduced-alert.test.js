

import { jest } from '@jest/globals';
import { validatorBalanceReducedAlert } from '../../src/alerts/validator-balance-reduced-alert';
import { newValidatorState } from '../test-utils/validator-state-factory';

describe('validatorBalanceReducedAlert', () => {
  const MIN_EPOCHS_TO_TRIGGER = 3;
  const BALANCE_REDUCED_NOTIFY_INTERVAL_EPOCHS = 10;

  const alertConfig = {
    minEpochsToTrigger: MIN_EPOCHS_TO_TRIGGER,
    notifyIntervalEpochs: BALANCE_REDUCED_NOTIFY_INTERVAL_EPOCHS
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

    expect(notifierMock.notify).toHaveBeenCalledTimes(1);
  });

  it('should NOT notify again when triggered until {BALANCE_REDUCED_NOTIFY_INTERVAL_HOURS}', () => {
    let validatorState = newValidatorState();

    const triggerBalanceReduced = (previous) => {
      const newBalance = Number(validatorState.balance) - 1;
      const current = { ...previous, balance: newBalance.toString() }
      alert([{ previous, current }]);
      return current;
    }

    for (let i = 0; i < MIN_EPOCHS_TO_TRIGGER; i++) {
      validatorState = triggerBalanceReduced(validatorState);
    }
    expect(notifierMock.notify).toHaveBeenCalledTimes(1);

    // should not retrigger until {BALANCE_REDUCED_NOTIFY_INTERVAL_EPOCHS} epochs
    for (let i = 0; i < BALANCE_REDUCED_NOTIFY_INTERVAL_EPOCHS - 1; i++) {
      validatorState = triggerBalanceReduced(validatorState);
    }
    expect(notifierMock.notify).toHaveBeenCalledTimes(1);

    // triggered the 2nd time if it continues to fail after {BALANCE_REDUCED_NOTIFY_INTERVAL_EPOCHS} epochs
    validatorState = triggerBalanceReduced(validatorState);
    expect(notifierMock.notify).toHaveBeenCalledTimes(2);
  });

});

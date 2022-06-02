

import { jest } from '@jest/globals';
import { validatorBalanceReducedAlert } from '../../src/alerts/validator-balance-reduced-alert';
import { newValidatorState } from '../test-utils/validator-state-factory';

describe('validatorBalanceReducedAlert', () => {
  let notifierMock;

  beforeEach(() => {
    notifierMock = {
      notify: jest.fn()
    }
  });

  it('should NOT notify when validator does NOT have a previous state', () => {
    const validatorState = newValidatorState();

    validatorBalanceReducedAlert(notifierMock, [{
      current: validatorState
    }]);

    expect(notifierMock.notify).not.toBeCalled();
  });

  it('should NOT notify when validator balance has increased from previous state', () => {
    const validatorState = newValidatorState();
    const newBalance = Number(validatorState.balance) + 1;

    validatorBalanceReducedAlert(notifierMock, [{
      current: { ...validatorState, balance: newBalance.toString() },
      previous: validatorState
    }]);

    expect(notifierMock.notify).not.toBeCalled();
  });

  it('should notify when validator balance has reduced from previous state', () => {
    const previous = newValidatorState();
    const newBalance = Number(previous.balance) - 1;
    const current = { ...previous, balance: newBalance.toString() }

    validatorBalanceReducedAlert(notifierMock, [{ previous, current }]);

    expect(notifierMock.notify).toBeCalled();
  });

});

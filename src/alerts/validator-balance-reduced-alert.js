import assert from 'assert';
import { logger } from '../logger.js';

const validatorBalanceReducedAlert = (notifier, alertConfig) => {
  const { minEpochsToTrigger, notifyIntervalEpochs } = alertConfig;

  /** An array of array that tracks validators that have had balance reduced in last n epochs */
  const balanceReducedValidatorsList = Array(minEpochsToTrigger).fill([]);
  
  /** Last alert triggered. only resend the same alert after {notifyIntervalEpochs} epochs */
  let triggeredAlert = '';
  let triggeredAlertCount = 0;

  return (validators) => {
    const balanceReducedValidators = validators
      .filter(v => !!v.previous) // ignore newly added validators without previous state
      .filter(v => {
        const currentEpochBalance = v.current.balance;
        const previousEpochBalance = v.previous.balance;
        return (Number(currentEpochBalance) < Number(previousEpochBalance));
      })
      .map(v => v.current);

    balanceReducedValidatorsList.push(balanceReducedValidators);

    if (balanceReducedValidatorsList.length > minEpochsToTrigger) {
      balanceReducedValidatorsList.shift();
    }

    assert(balanceReducedValidatorsList.length === minEpochsToTrigger, 'Unexpected list length!');

    // look for validators that have failed for n consecutive epochs
    const validatorsToAlert = balanceReducedValidatorsList.reduce((accumulator, currentList) => {
      return accumulator.filter(v1 => currentList.some(v2 => v1.index === v2.index));
    });

    if (validatorsToAlert.length > 0) {
      const validatorIndicesCsv = validatorsToAlert.map(v => v.index).join(',');
      const message = `${validatorsToAlert.length} out of ${validators.length} validators have balance reduced since last epoch. Please check validator(s) ${validatorIndicesCsv}.`;
      
      if (triggeredAlert !== message || triggeredAlertCount >= notifyIntervalEpochs) {
        notifier.notify(message);
        triggeredAlert = message;
        triggeredAlertCount = 1;
      } else {
        triggeredAlertCount++;
      }
      
    } else {
      logger.info(`All ${validators.length} validators balances are healthy.`)
    }
  }
}

export { validatorBalanceReducedAlert };
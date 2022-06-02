import assert from 'assert';

const validatorBalanceReducedAlert = (notifier, alertConfig) => {
  const { minEpochsToTrigger } = alertConfig;

  // an array of array that tracks validators that have had balance reduced in last n epochs
  const balanceReducedValidatorsList = Array(minEpochsToTrigger).fill([]);

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
      notifier.notify(message);
    } else {
      console.debug(`All ${validators.length} valiators balances are healthy.`)
    }
  }
}

export { validatorBalanceReducedAlert };
function validatorBalanceReducedAlert(notifier, validators) {
  const validatorsToAlert = validators
  .filter(v => !!v.previous) // ignore newly added validators without previous state
  .filter(v => {
    const currentEpochBalance = v.current.balance;
    const previousEpochBalance = v.previous.balance;
    return (Number(currentEpochBalance) <= Number(previousEpochBalance))
  });

  if (validatorsToAlert.length > 0) {
    const validatorIndicesCsv = validatorsToAlert.map(v => v.current.index).join(',');
    const message = `${validatorsToAlert.length} out of ${validators.length} validators have balance reduced since last epoch. Please check validator(s) ${validatorIndicesCsv}.`;
    notifier.notify(message);
  } else {
    console.debug(`All ${validators.length} valiators balances are healthy.`)
  }
}

export { validatorBalanceReducedAlert };
function validatorBalanceReducedAlert(notifier, validators) {
  const validatorsToAlert = validators.filter(v => {
    const currentEpochBalance = v.current.balance;
    const previousEpochBalance = v.previous.balance;
    return (Number(currentEpochBalance) <= Number(previousEpochBalance))
  });

  if (validatorsToAlert.length > 0) {
    const validatorIndicesTruncated = getTruncatedValidatorIndices(validatorsToAlert);
    const message = `${validatorsToAlert.length} out of ${validators.length} validators have balance reduced since last epoch. Please check validator(s) ${validatorIndicesTruncated}.`;
    notifier.notify(message);
  } else {
    console.debug(`All ${validators.length} valiators balances are healthy.`)
  }
}

function getTruncatedValidatorIndices(validators) {
  const validatorIndicesCsv = validators.map(v => v.current.index).join(',');
  if (validatorIndicesCsv.length > 60) {
    return validatorIndicesCsv.slice(0, 60) + '...';
  }
  return validatorIndicesCsv;
}

export { validatorBalanceReducedAlert };
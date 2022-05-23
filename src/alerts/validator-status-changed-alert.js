function validatorStatusChangedAlert(notifier, validators) {
  validators.forEach(v => {
    const currentStatus = v.current.status;
    const previousStatus = v.previous.status;

    if (currentStatus !== previousStatus) {
      const message = `Validator ${v.current.index} has transitioned from ${previousStatus} to ${currentStatus}.`
      notifier.notify(message);
    }
  });
}

export { validatorStatusChangedAlert };

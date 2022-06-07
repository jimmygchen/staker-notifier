const validatorStatusChangedAlert = (notifier) => {
  return (validators) => {
    validators.forEach(v => {
      const currentStatus = v.current.status;
      const previousStatus = v.previous && v.previous.status || 'unknown';
  
      if (currentStatus !== previousStatus) {
        const message = `Validator ${v.current.index} has transitioned from ${previousStatus} to ${currentStatus}.`
        notifier.notify(message);
      }
    });
  };
}

export { validatorStatusChangedAlert };

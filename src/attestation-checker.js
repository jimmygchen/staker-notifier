class AttestationChecker {
    constructor(config, notifier) {
        this.config = config;
        this.notifier = notifier;
    }

    start() {
        this.notifier.notify("hello world!")
    }
}

module.exports = { AttestationChecker }
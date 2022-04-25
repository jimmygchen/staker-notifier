const { ValidatorBalanceChecker } = require('./validator-balance-checker')
const { SMSNotifier } = require('./sms-notifier')
const { config } = require('./config')

const notifer = new SMSNotifier(config.sms)
const checker = new ValidatorBalanceChecker(config.balanceChecker, notifer)
checker.start(config.pubkeys);

import { ValidatorPollingService } from './validator-polling-service.js';
import { SMSNotifier, TelegramNotifier } from './notifiers/index.js';
import { config } from './config.js';
import { BeaconAPIClient } from './beacon-api-client.js';
import { validatorBalanceReducedAlert, validatorStatusChangedAlert } from './alerts/index.js';
import { logger } from './logger.js';

const notifiers = [];
if (config.sms) notifiers.push(new SMSNotifier(config.sms));
if (config.telegram) notifiers.push(new TelegramNotifier(config.telegram));

if (notifiers.length === 0) {
  throw new Error('Missing notifier config, check your .env file!');
}
const beaconApiClient = new BeaconAPIClient(config.beaconAPIs);
const validatorPollingService = new ValidatorPollingService(beaconApiClient);

validatorPollingService.addValidators(config.pubkeys);
notifiers.forEach((notifier) => {
  validatorPollingService.addListener(validatorBalanceReducedAlert(notifier, config.alerts.validatorBalanceReduced));
  validatorPollingService.addListener(validatorStatusChangedAlert(notifier));
});
validatorPollingService.start()
  .catch((err) => {
    logger.error(`Error polling validators from Beacon API ${config.beaconAPIs}: `, err);
    throw err;
  });

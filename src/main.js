import { ValidatorPollingService } from './validator-polling-service.js';
import { SMSNotifier, TelegramNotifier } from './notifiers/index.js';
import { config } from './config.js';
import { BeaconAPIClient } from './beacon-api-client.js';
import { validatorBalanceReducedAlert, validatorStatusChangedAlert } from './alerts/index.js';
import { logger } from './logger.js';

const smsNotifier = new SMSNotifier(config.sms);
const telegramNotifier = new TelegramNotifier(config.telegram);
const beaconApiClient = new BeaconAPIClient(config.beaconAPIs);
const validatorPollingService = new ValidatorPollingService(beaconApiClient);

validatorPollingService.addValidators(config.pubkeys);
validatorPollingService.addListener(validatorBalanceReducedAlert(smsNotifier, config.alerts.validatorBalanceReduced));
validatorPollingService.addListener(validatorBalanceReducedAlert(telegramNotifier, config.alerts.validatorBalanceReduced));
validatorPollingService.addListener(validatorStatusChangedAlert(smsNotifier));
validatorPollingService.addListener(validatorStatusChangedAlert(telegramNotifier));
validatorPollingService.start()
  .catch((err) => {
    logger.error(`Error polling validators from Beacon API ${config.beaconAPIs}: `, err);
    throw err;
  });

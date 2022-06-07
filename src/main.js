import { ValidatorPollingService } from './validator-polling-service.js';
import { SMSNotifier } from './notifiers/index.js';
import { config } from './config.js';
import { BeaconAPIClient } from './beacon-api-client.js';
import { validatorBalanceReducedAlert, validatorStatusChangedAlert } from './alerts/index.js';

const smsNotifer = new SMSNotifier(config.sms)
const beaconApiClient = new BeaconAPIClient(config.beaconAPIs);
const validatorPollingService = new ValidatorPollingService(beaconApiClient);

validatorPollingService.addValidators(config.pubkeys);
validatorPollingService.addListener(validatorBalanceReducedAlert(smsNotifer, config.alerts.validatorBalanceReduced));
validatorPollingService.addListener(validatorStatusChangedAlert(smsNotifer));
validatorPollingService.start();

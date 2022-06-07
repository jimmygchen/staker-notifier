import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'staker-notifier' },
  transports: [
    new transports.File({ filename: 'staker-notifier-error.log', level: 'error' }),
    new transports.File({ filename: 'staker-notifier-combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.timestamp(),
      format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    )
  }));
}

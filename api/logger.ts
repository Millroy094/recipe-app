import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp, stack }) => {
          if (stack) {
            return `${timestamp} [${level.toLocaleUpperCase()}]: ${message} - ${stack}`;
          }
          return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        }),
      ),
    }),
  ],
});

export default logger;

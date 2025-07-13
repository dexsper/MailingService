import * as env from 'env-var';
import type { Config } from './interface';

export default (): Config => {
  return {
    database: {
      type: 'postgres',
      logging: env.get('DB_LOGGING').default(0).asBool(),
      host: env.get('DB_HOST').required().asString(),
      port: env.get('DB_PORT').required().asPortNumber(),
      username: env.get('DB_USER').required().asString(),
      password: env.get('DB_PASSWORD').asString(),
      database: env.get('DB_DATABASE').required().asString(),
    },
    nest: {
      port: env.get('PORT').default(3001).asPortNumber(),
      cors: env.get('CORS').default(1).asBool(),
    },
    swagger: {
      enabled: env.get('SWAGGER_ENABLED').default(0).asBool(),
      title: 'Mail service backend',
      description: 'The api description',
      version: '1.0',
      path: env.get('SWAGGER_URL').default('docs').asString(),
    },
    auth: {
      jwtSecret: env.get('AUTH_JWT_SECRET').required().asString(),
    },
    imap: {
      proxy: env.get('IMAP_PROXY').required().asJsonArray(),
    },
  };
};

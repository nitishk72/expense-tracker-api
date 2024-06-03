import { Config } from 'newrelic';

const config: Config = {
  app_name: [process.env.NEW_RELIC_APP_NAME || 'Your Application Name'],
  license_key: process.env.NEW_RELIC_LICENSE_KEY || 'YOUR_NEW_RELIC_LICENSE_KEY',
  distributed_tracing: {
    enabled: true,
  },
  logging: {
    level: 'info',
  },
  allow_all_headers: true,
  attributes: {
    exclude: [
      'request.headers.cookie',
      'request.headers.authorization',
      'request.headers.proxyAuthorization',
      'request.headers.setCookie*',
      'request.headers.x*',
      'response.headers.cookie',
      'response.headers.authorization',
      'response.headers.proxyAuthorization',
      'response.headers.setCookie*',
      'response.headers.x*',
    ],
  },
};

export default config;
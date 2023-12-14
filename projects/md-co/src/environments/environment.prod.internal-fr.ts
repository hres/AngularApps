import {baseEnv as base} from './env';

export const environment = {
  ...base,
  production: true,
  serverBaseUrl: 'https://prod-server.com',
  internal: true,
  lang: 'fr',
};

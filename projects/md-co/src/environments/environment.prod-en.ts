import {baseEnv as base} from './env';

export const environment = {
  ...base,
  production: true,
  serverBaseUrl: 'https://en.prod-server.com',
  internal: false,
  lang: 'en',
};

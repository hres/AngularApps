import {baseEnv as base} from './env';

export const environment = {
  ...base,
  production: true,
  serverBaseUrl: 'https://fr.prod-server.com',
  internal: false,
  lang: 'fr',
};

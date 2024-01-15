import {baseEnv as base} from './env';

export const environment = {
  ...base,
  production: true,
  serverBaseUrl: 'https://lam-dev.hres.ca/rep-dev/',
  internal: false,
  lang: 'en',
};

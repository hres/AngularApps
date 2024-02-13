import {baseEnv as base} from './env';

export const environment = {
  ...base,
  production: true,
  serverBaseUrl: 'https://lam-dev.hres.ca/REP-Form/',
  internal: false,
  lang: 'en',
};

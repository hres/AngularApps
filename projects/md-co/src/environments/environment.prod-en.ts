import {baseEnv as base} from './env';

// environment setting for English external prod
export const environment = {
  ...base,
  production: true,
  serverBaseUrl: 'https://lam-dev.hres.ca/REP-Form/',
  internal: false,
  lang: 'en',
};

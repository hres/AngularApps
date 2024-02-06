import {baseEnv as base} from './env';

// environment setting for French external prod
export const environment = {
  ...base,
  production: true,
  serverBaseUrl: 'https://lam-dev.hres.ca/REP-Form/',
  internal: false,
  lang: 'fr',
};

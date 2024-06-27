import {baseEnv as base} from './env';

export const environment = {
  ...base,
  production: true,
  serverBaseUrl: 'https://health-products.canada.ca/',
  lang: 'fr',
};

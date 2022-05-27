'use strict';

const { validateConfig } = require('../validation');

module.exports = {
  default: ({ env }) => ({
    hostName: env('HOST_NAME'),
    apiKey: env('SHOPIFY_API_KEY'),
    apiSecret: env('SHOPIFY_API_SECRET'),
    scopes: env.array('SHOPIFY_SCOPES', []),
    isEmbedded: env.bool('SHOPIFY_APP_EMBEDDED'),
    redirectUrl: env('SHOPIFY_REDIRECT_URL'),
  }),
  validator: (config) => {
    validateConfig(config);
  },
};

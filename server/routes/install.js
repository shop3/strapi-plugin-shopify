'use strict';

module.exports = [
  {
    method: 'GET',
    path: '/shopify/install',
    handler: 'install.init',
    config: {
      auth: false,
      prefix: '',
      policies: ['plugin::shopify.valid-query-hmac'],
    },
  },
  {
    method: 'GET',
    path: '/shopify/install/callback',
    handler: 'install.callback',
    config: {
      auth: false,
      prefix: '',
      policies: ['plugin::shopify.valid-query-hmac'],
    },
  },
];

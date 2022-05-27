'use strict';

module.exports = [
  {
    method: 'GET',
    path: '/shopify',
    handler: 'shopify.index',
    config: {
      auth: false,
      prefix: '',
      policies: ['plugin::shopify.valid-entry-point'],
    },
  },
  {
    method: 'POST',
    path: '/shopify/webhooks',
    handler: 'shopify.webhooks',
    config: {
      auth: false,
      prefix: '',
      policies: ['plugin::shopify.valid-body-hmac'],
    },
  },
];

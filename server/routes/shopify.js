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
  {
    method: 'GET',
    path: '/shopify/me',
    handler: 'shopify.me',
    config: {
      prefix: '',
      policies: ['plugin::shopify.is-authenticated'],
    },
  },
];

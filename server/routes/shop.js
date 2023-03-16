'use strict';

module.exports = [
  {
    method: 'GET',
    path: '/shopify/shop',
    handler: 'shop.data',
    config: {
      prefix: '',
      policies: ['plugin::shopify.is-authenticated'],
    },
  },
  {
    method: 'POST',
    path: '/shopify/webhooks/gdpr/shop/redact',
    handler: 'shop.redact',
    config: {
      auth: false,
      prefix: '',
      policies: ['plugin::shopify.valid-body-hmac'],
    },
  },
];

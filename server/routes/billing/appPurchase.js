'use strict';

module.exports = [
  {
    method: 'POST',
    path: '/shopify/appPurchase',
    handler: 'appPurchase.create',
    config: {
      prefix: '',
      policies: ['plugin::shopify.is-authenticated'],
    },
  },
];

'use strict';

module.exports = [
  {
    method: 'POST',
    path: '/shopify/subscription',
    handler: 'subscription.create',
    config: {
      prefix: '',
      policies: ['plugin::shopify.is-authenticated'],
    },
  },
  {
    method: 'GET',
    path: '/shopify/subscription',
    handler: 'subscription.find',
    config: {
      prefix: '',
      policies: ['plugin::shopify.is-authenticated'],
    },
  },
];

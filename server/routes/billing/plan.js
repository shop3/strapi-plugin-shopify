'use strict';

module.exports = [
  {
    method: 'GET',
    path: '/shopify/plans',
    handler: 'plan.find',
    config: {
      prefix: '',
      policies: ['plugin::shopify.is-authenticated'],
    },
  },
];

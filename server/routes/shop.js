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
];

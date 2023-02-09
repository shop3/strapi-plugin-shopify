'use strict';

module.exports = [
  {
    method: 'GET',
    path: '/shopify/plans',
    handler: 'plan.find',
    config: {
      auth: false,
      prefix: '',
      //policies: ['plugin::shopify.is-authenticated'],
    },
  },
  {
    method: 'POST',
    path: '/shopify/plans/create',
    handler: 'plan.create',
    config: {
      auth: false,
      prefix: '',
      //policies: ['plugin::shopify.is-authenticated'],
    },
  },
  {
    method: 'PUT',
    path: '/shopify/plans/edit',
    handler: 'plan.edit',
    config: {
      auth: false,
      prefix: '',
      //policies: ['plugin::shopify.is-authenticated'],
    },
  },
  {
    method: 'POST',
    path: '/shopify/plans/delete',
    handler: 'plan.delete',
    config: {
      auth: false,
      prefix: '',
      //policies: ['plugin::shopify.is-authenticated'],
    },
  },
];

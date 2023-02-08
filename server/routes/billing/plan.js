'use strict';

module.exports = {
  'admin': [
    {
      method: 'GET',
      path: '/shopify/plans',
      handler: 'plan.find',
      config: {
        prefix: '',
        policies: [
          {
            name: 'admin::hasPermissions',
            config: {
              actions: ['plugin::shopify.plan.read'],
            },
          },
        ],
      },
    },
    {
      method: 'POST',
      path: '/shopify/plans/create',
      handler: 'plan.create',
      config: {
        prefix: '',
        policies: [
          {
            name: 'admin::hasPermissions',
            config: {
              actions: ['plugin::shopify.plan.read'],
            },
          },
        ],
      },
    },
    {
      method: 'PUT',
      path: '/shopify/plans/edit',
      handler: 'plan.edit',
      config: {
        prefix: '',
        policies: [
          {
            name: 'admin::hasPermissions',
            config: {
              actions: ['plugin::shopify.plan.read'],
            },
          },
        ],
      },
    },
    {
      method: 'POST',
      path: '/shopify/plans/delete',
      handler: 'plan.delete',
      config: {
        prefix: '',
        policies: [
          {
            name: 'admin::hasPermissions',
            config: {
              actions: ['plugin::shopify.plan.read'],
            },
          },
        ],
      },
    },
  ],
  'content-api': []
};

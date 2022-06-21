'use strict';

module.exports = [
  {
    method: 'GET',
    path: '/shopify/settings',
    handler: 'settings.read',
    config: {
      prefix: '',
      policies: [
        {
          name: 'admin::hasPermissions',
          config: {
            actions: ['plugin::shopify.settings.read'],
          },
        },
      ],
    },
  },
];

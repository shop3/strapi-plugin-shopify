'use strict';

const authRoutes = require('./auth');
const installRoutes = require('./install');
const settingsRoutes = require('./settings');
const shopRoutes = require('./shop');
const shopifyRoutes = require('./shopify');
const billing = require('./billing');

module.exports = {
  admin: {
    type: 'admin',
    routes: [...settingsRoutes, ...billing['admin']],
  },
  'content-api': {
    type: 'content-api',
    routes: [...authRoutes, ...installRoutes, ...shopRoutes, ...shopifyRoutes, ...billing['content-api']],
  },
};

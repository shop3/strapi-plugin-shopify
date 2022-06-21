'use strict';

const authRoutes = require('./auth');
const installRoutes = require('./install');
const settingsRoutes = require('./settings');
const shopRoutes = require('./shop');
const shopifyRoutes = require('./shopify');

module.exports = {
  admin: {
    type: 'admin',
    routes: [...settingsRoutes],
  },
  'content-api': {
    type: 'content-api',
    routes: [...authRoutes, ...installRoutes, ...shopRoutes, ...shopifyRoutes],
  },
};

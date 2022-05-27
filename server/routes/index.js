'use strict';

const authRoutes = require('./auth');
const installRoutes = require('./install');
const shopRoutes = require('./shop');
const shopifyRoutes = require('./shopify');

module.exports = {
  'content-api': {
    type: 'content-api',
    routes: [...authRoutes, ...installRoutes, ...shopRoutes, ...shopifyRoutes],
  },
};

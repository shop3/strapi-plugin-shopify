'use strict';

const auth = require('./auth');
const install = require('./install');
const settings = require('./settings');
const shop = require('./shop');
const shopify = require('./shopify');
const billing = require('./billing');

module.exports = {
  auth,
  install,
  settings,
  shop,
  shopify,
  ...billing,
};

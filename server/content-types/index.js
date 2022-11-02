'use strict';

const shop = require('./Shop');
const session = require('./Session');
const billing = require('./Billing');

module.exports = {
  session,
  shop,
  ...billing,
};

'use strict';

const plan = require('./plan');
const subscription = require('./subscription');
const appPurchase = require('./appPurchase');

const disableBilling = process.env.SHOPIFY_DISABLE_BILLING === 'true';

const enabledExport = {
  plan,
  subscription,
  appPurchase,
};

module.exports = !disableBilling ? enabledExport : {};

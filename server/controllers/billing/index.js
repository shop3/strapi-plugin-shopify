'use strict';

const plan = require('./plan');
const subscription = require('./subscription');

const disableBilling = process.env.SHOPIFY_DISABLE_BILLING === 'true';

const enabledExport = {
  plan,
  subscription,
};

module.exports = !disableBilling ? enabledExport : {};

'use strict';

const subscription = require('./subscription');

const disableBilling = process.env.SHOPIFY_DISABLE_BILLING === 'true';

const enabledExport = {
  subscription,
};

module.exports = !disableBilling ? enabledExport : {};

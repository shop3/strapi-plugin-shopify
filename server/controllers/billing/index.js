'use strict';

const subscription = require('./subscription');

const disableBilling = process.env.SHOPIFY_DISABLE_BILLING === 'true';

module.exports = !disableBilling ? {
  subscription: disableBilling || subscription,
} : {};

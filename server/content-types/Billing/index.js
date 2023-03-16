'use strict';

const Plan = require('./Plan');
const Subscription = require('./Subscription');
const UsageRecord = require('./UsageRecord');
const AppPurchase = require('./AppPurchase');

const disableBilling = process.env.SHOPIFY_DISABLE_BILLING === 'true';

const enabledExport = {
  plan: Plan,
  subscription: Subscription,
  'usage-record': UsageRecord,
  'app-purchase': AppPurchase,
};

module.exports = !disableBilling ? enabledExport : {};

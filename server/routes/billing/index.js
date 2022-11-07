'use strict';

const planRoutes = require('./plan');
const subscriptionRoutes = require('./subscription');

const disableBilling = process.env.SHOPIFY_DISABLE_BILLING === 'true';

const enabledExport = {
  admin: [],
  'content-api': [...planRoutes, ...subscriptionRoutes],
};

const disabledExport = {
  admin: [],
  'content-api': [],
};

module.exports = !disableBilling ? enabledExport : disabledExport;

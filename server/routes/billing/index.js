'use strict';

const subscriptionRoutes = require('./subscription');

const disableBilling = process.env.SHOPIFY_DISABLE_BILLING === 'true';

const enabledExport = {
  admin: [],
  'content-api': [...subscriptionRoutes],
};

const disabledExport = {
  admin: [],
  'content-api': [],
};

module.exports = !disableBilling ? enabledExport : disabledExport;

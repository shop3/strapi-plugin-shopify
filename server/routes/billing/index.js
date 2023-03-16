'use strict';

const planRoutes = require('./plan');
const subscriptionRoutes = require('./subscription');

const disableBilling = process.env.SHOPIFY_DISABLE_BILLING === 'true';

const enabledExport = {
  admin: [...planRoutes['admin']],
  'content-api': [...planRoutes['content-api'], ...subscriptionRoutes],
};

const disabledExport = {
  admin: [],
  'content-api': [],
};

module.exports = !disableBilling ? enabledExport : disabledExport;

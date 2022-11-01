'use strict';

const subscriptionRoutes = require('./subscription');

const disableBilling = process.env.SHOPIFY_DISABLE_BILLING === 'true';

module.exports = !disableBilling ? {
  'admin': [],
  'content-api': [
    ...subscriptionRoutes,
  ],
} : {
  'admin': [],
  'content-api': [],
};

'use strict';

const { actions } = require('./actions');

const disableBilling = process.env.SHOPIFY_DISABLE_BILLING === 'true';

module.exports = async ({ strapi }) => {
  // add plugin actions
  const permissionService = strapi.service('admin::permission');
  await permissionService.actionProvider.registerMany(actions);
  // initialize shopify
  const shopifyService = strapi.service('plugin::shopify.shopify');
  shopifyService.initializeContext();
  shopifyService.initializeWebhooks();
  // initialize shopify billing
  if (!disableBilling) {
    const billingInitService = strapi.service('plugin::shopify.billing-init');
    billingInitService.initialize();
  }
};

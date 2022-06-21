'use strict';

const { actions } = require('./actions');

module.exports = async ({ strapi }) => {
  // add plugin actions
  const permissionService = strapi.service('admin::permission');
  await permissionService.actionProvider.registerMany(actions);
  // initialize shopify
  const shopifyService = strapi.service('plugin::shopify.shopify');
  shopifyService.initializeContext();
  shopifyService.initializeWebhooks();
};

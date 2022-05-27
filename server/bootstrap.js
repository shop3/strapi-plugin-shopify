'use strict';

module.exports = async ({ strapi }) => {
  // initialize shopify
  const shopifyService = strapi.service('plugin::shopify.shopify');
  shopifyService.initializeContext();
  shopifyService.initializeWebhooks();
};

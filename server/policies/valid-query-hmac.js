'use strict';

const Shopify = require('@shopify/shopify-api').default;

module.exports = (ctx, config, { strapi }) => {
  const { hmac: receivedHmac, ...query } = ctx.request.query;
  if (!receivedHmac) return false;
  const utils = strapi.service('plugin::shopify.utils');
  const calculatedHmac = utils.calculateQueryHmac(query);
  return Shopify.Utils.safeCompare(receivedHmac, calculatedHmac);
};

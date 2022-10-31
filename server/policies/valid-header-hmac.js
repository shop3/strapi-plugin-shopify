'use strict';

const Shopify = require('@shopify/shopify-api').default;
const { ShopifyHeader } = require('@shopify/shopify-api');

module.exports = (ctx, config, { strapi }) => {
  const receivedHmac = ctx.request.get(ShopifyHeader.Hmac);
  if (!receivedHmac) return false;
  const query = ctx.request.query;
  const utils = strapi.service('plugin::shopify.utils');
  const calculatedHmac = utils.calculateQueryHmac(query, 'base64');
  return Shopify.Utils.safeCompare(receivedHmac, calculatedHmac);
};

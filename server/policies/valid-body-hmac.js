'use strict';

const Shopify = require('@shopify/shopify-api').default;
const { ShopifyHeader } = require('@shopify/shopify-api');
const unparsed = require('koa-body/unparsed');

module.exports = (ctx, config, { strapi }) => {
  const receivedHmac = ctx.request.get(ShopifyHeader.Hmac);
  if (!receivedHmac) return false;
  const unparsedBody = ctx.request.body[unparsed];
  if (!unparsedBody) return false;
  const utils = strapi.service('plugin::shopify.utils');
  const calculatedHmac = utils.calculateBodyHmac(unparsedBody);
  return Shopify.Utils.safeCompare(receivedHmac, calculatedHmac);
};

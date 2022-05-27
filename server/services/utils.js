'use strict';

const crypto = require('crypto');
const qs = require('qs');
const Shopify = require('@shopify/shopify-api').default;
const unparsed = require('koa-body/unparsed');

module.exports = ({ strapi }) => ({
  calculateQueryHmac(params) {
    const secret = Shopify.Context.API_SECRET_KEY;
    return crypto
      .createHmac('sha256', secret)
      .update(qs.stringify(params, { sort: (a, b) => a.localeCompare(b) }))
      .digest('hex');
  },

  calculateBodyHmac(body) {
    const secret = Shopify.Context.API_SECRET_KEY;
    const unparsedBody = typeof body === 'string' ? body : body[unparsed];
    return crypto.createHmac('sha256', secret).update(unparsedBody).digest('base64');
  },

  generateQuery(params) {
    const timestamp = Date.now();
    const hmac = this.calculateQueryHmac({ ...params, timestamp });
    return qs.stringify({ ...params, timestamp, hmac });
  },
});

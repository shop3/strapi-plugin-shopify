'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const _ = require('lodash');

module.exports = createCoreController('plugin::shopify.shop', ({ strapi }) => ({
  data: async (ctx) => {
    const session = _.get(ctx, 'state.shopify.session');
    const shopData = await strapi.service('plugin::shopify.shop').findByDomain(session.shop);
    ctx.send(shopData);
  },

  redact: async (ctx) => {
    const domain = _.get(ctx, 'request.body.shop_domain');
    await strapi.service('plugin::shopify.shop').redact(domain);
    ctx.send({
      message: 'ok',
    })
  },
}));

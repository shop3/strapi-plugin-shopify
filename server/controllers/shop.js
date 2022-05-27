'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('plugin::shopify.shop', ({ strapi }) => ({
  data: async (ctx) => {
    const session = ctx.state.shopify;
    const shopData = await strapi.service('plugin::shopify.shop').findByDomain(session.shop);
    ctx.send(shopData);
  },
}));

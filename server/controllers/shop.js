'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const _ = require('lodash');

module.exports = createCoreController('plugin::shopify.shop', ({ strapi }) => ({
  data: async (ctx) => {
    const session = _.get(ctx, 'state.shopify.session');
    const shopData = await strapi.service('plugin::shopify.shop').findByDomain(session.shop);
    ctx.send(shopData);
  },
}));

'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const _ = require('lodash');

module.exports = createCoreController('plugin::shopify.shop', ({ strapi }) => ({
  data: async (ctx) => {
    const session = _.get(ctx, 'state.shopify.session');
    const shopData = await strapi.service('plugin::shopify.shop').findByDomain(session.shop);
    ctx.send(shopData);
  },
  delete: async (ctx) => {
    const domain = _.get(ctx, 'request.body.domain');;
    const shopData = await strapi.service('plugin::shopify.shop').deleteByDomain(domain);
    ctx.status = 200;
    ctx.send(shopData);
  },
}));

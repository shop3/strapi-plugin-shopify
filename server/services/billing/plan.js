'use strict';

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('plugin::shopify.plan', ({ strapi }) => ({
  async findOne(id) {
    const plan = await strapi.query('plugin::shopify.plan').findOne({ id });
    return plan;
  },
}));

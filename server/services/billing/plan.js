'use strict';

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('plugin::shopify.plan', ({ strapi }) => ({
  async findPlans() {
    const plan = await strapi.query('plugin::shopify.plan').findMany();
    return plan;
  },
  async createPlan(data) {
    const plan = await strapi.query('plugin::shopify.plan').create({ data });
    return plan;
  },
  async editPlan({data, id}) {
    const plan = await strapi.query('plugin::shopify.plan').update({where: { id: id }, data});
    return plan;
  },
  async deletePlan(id) {
    const plan = await strapi.query('plugin::shopify.plan').delete({where: { id: id }});
    return plan;
  },
}));

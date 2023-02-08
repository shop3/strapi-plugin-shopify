'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const _ = require('lodash');

module.exports = createCoreController('plugin::shopify.plan', ({ strapi }) => ({
  find: async (ctx) => {
    const planData = await strapi.service('plugin::shopify.plan').findPlans();
    console.log(ctx);
    ctx.status = 200;
    ctx.send(planData);
  },
  create: async (ctx) => {
    const data = _.get(ctx, 'request.body');
    const planService = strapi.service('plugin::shopify.plan');
    try {
      const plan = await planService.createPlan(data);
      ctx.status = 200;
      ctx.body = { plan };
    } catch (e) {
      strapi.log.error(e.message);
      ctx.badRequest('Failed to create the plan');
    }
  },
  edit: async (ctx) => {
    const data = _.get(ctx, 'request.body.data');
    const id = _.get(ctx, 'request.body.id');
    const planService = strapi.service('plugin::shopify.plan');
    try {
      const plan = await planService.editPlan({data, id});
      ctx.status = 200;
      ctx.body = { plan };
    } catch (e) {
      strapi.log.error(e.message);
      ctx.badRequest('Failed to edit the plan');
    }
  },
  delete: async (ctx) => {
    const id = _.get(ctx, 'request.body.id');
    const planService = strapi.service('plugin::shopify.plan');
    try {
      const plan = await planService.deletePlan(id);
      ctx.status = 200;
      ctx.body = { plan };
    } catch (e) {
      strapi.log.error(e.message);
      ctx.badRequest('Failed to delete the plan');
    }
  }
}));
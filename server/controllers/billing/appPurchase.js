'use strict';

const _ = require('lodash');

module.exports = ({ strapi }) => ({
  async create(ctx) {
    const { returnUrl } = ctx.query;
    // get subscription service
    const appPurchaseService = strapi.service('plugin::shopify.appPurchase');
    // get plan id from body
    const planId = ctx.request.body.planId;
    if (_.isUndefined(planId)) return ctx.badRequest('Missing planId');
    // get plan service
    const planService = strapi.service('plugin::shopify.plan');
    // get plan
    const plan = await planService.findOne(planId);
    if (_.isNull(plan)) return ctx.badRequest('Plan not found');
    // create subscription
    const appPurchase = {
      planId: planId,
      name: plan.name,
      price: plan.recurringPrice,
      currencyCode: plan.currencyCode,
      test: plan.test,
    };
    // set return Url
    if (returnUrl) {
      appPurchase.returnUrl = returnUrl;
    }
    // create new appPurchase
    try {
      const confirmationUrl = await appPurchaseService.create(appPurchase);
      ctx.body = { confirmationUrl };
    } catch (e) {
      strapi.log.error(e.message);
      ctx.badRequest('Failed to complete the appPurchase');
    }
  },
});

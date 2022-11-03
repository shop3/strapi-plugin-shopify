'use strict';

const _ = require('lodash');

module.exports = ({ strapi }) => ({
  async create(ctx) {
    const { returnUrl } = ctx.query;
    // get shopify session
    const { shop, accessToken } = _.get(ctx, 'state.shopify.session');
    // get subscription service
    const subscriptionService = strapi.service('plugin::shopify.subscription');
    // find existing subscription
    const existingSubscription = await subscriptionService.findByShop(shop);
    // handle existing subscription
    if (!_.isEmpty(existingSubscription.data)) {
      switch (existingSubscription.data.status) {
        case 'ACTIVE':
          // return 409 if exists an ACTIVE subscription
          ctx.conflict();
          return;
        case 'PENDING':
          // return 200 if exists a PENDING subscription
          ctx.body = {
            confirmationUrl: existingSubscription.data.confirmation_url,
          };
          return;
        default:
          break;
      }
    }
    // get plan id from body
    const planId = ctx.request.body.planId;
    if (_.isUndefined(planId)) return ctx.badRequest('Missing planId');
    // get plan service
    const planService = strapi.service('plugin::shopify.plan');
    // get plan
    const plan = await planService.findOne(planId);
    if (_.isUndefined(plan)) return ctx.badRequest('Plan not found');
    // create subscription
    const subscription = {
      name: plan.name,
      recurring: {
        price: plan.recurringPrice,
        interval: plan.recurringInterval,
      },
      usage: {
        terms: plan.usageTerms,
        cappedAmount: plan.usageCappedAmount,
      },
      currencyCode: plan.currencyCode,
      trialDays: plan.trialDays,
      test: plan.test,
      planId: plan.id,
    };
    // override trial days if a subscription already exists
    if (!_.isEmpty(existingSubscription.data) && !_.isNull(existingSubscription.data.trial_ends_on)) {
      const utilsService = strapi.service('plugin::shopify.billing-utils');
      subscription.trialDays = utilsService.getRemainingTrialDays(existingSubscription.data.trial_ends_on);
    }
    // set return Url
    if (returnUrl) {
      subscription.returnUrl = returnUrl;
    }
    // create new subscription
    try {
      const confirmationUrl = await subscriptionService.create(subscription);
      ctx.body = { confirmationUrl };
    } catch (e) {
      strapi.log.error(e.message);
      ctx.badRequest('Failed to complete the subscription');
    }
  },

  async find(ctx) {
    const session = _.get(ctx, 'state.shopify.session');
    const subscriptionService = strapi.service('plugin::shopify.subscription');
    const subscriptionDb = await subscriptionService.findByShop(session.shop);
    if (_.isEmpty(subscriptionDb.data)) return ctx.notFound();
    if (subscriptionDb.data.status !== 'ACTIVE') return ctx.notFound();
    const subscriptionShopify = await subscriptionService.findOnShopify(subscriptionDb.data.id, session);
    ctx.body = {
      ...subscriptionDb,
      shopify: subscriptionShopify,
    };
  },
});

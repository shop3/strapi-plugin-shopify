'use strict';

const { createCoreService } = require('@strapi/strapi').factories;
const Shopify = require('@shopify/shopify-api').default;
const _ = require('lodash');
const { appSubscriptionCreate, appSubscriptionFind } = require('./graphql');

module.exports = createCoreService('plugin::shopify.subscription', ({ strapi }) => ({
  subscriptionGidToId(gid) {
    return Number(gid.replace('gid://shopify/AppSubscription/', ''));
  },

  subscriptionIdToGid(id) {
    return `gid://shopify/AppSubscription/${id}`;
  },

  async create(params) {
    const { planId, ...subscription } = params;
    // get strapi request context
    const ctx = strapi.requestContext.get();
    // get shop
    const shop = _.get(ctx, 'state.shopify.shop');
    // get shopify session
    const session = _.get(ctx, 'state.shopify.session');
    // get graphql client
    const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);

    // create subscription on Shopify
    const { confirmationUrl, subscriptionGid } = await appSubscriptionCreate(client, subscription);

    // get numeric id from gid
    const subscriptionId = this.subscriptionGidToId(subscriptionGid);
    // get trial end on
    const utilsService = strapi.service('plugin::shopify.billing-utils');
    const trialEndsOn = utilsService.calculateTrialEndsOn(subscription.trialDays);
    // create subscription on db
    await super.create({
      data: {
        id: subscriptionId,
        status: 'PENDING',
        trial_ends_on: trialEndsOn,
        confirmation_url: confirmationUrl,
        test: subscription.test,
        shop: shop.id,
        plan: planId,
      },
    });
    return confirmationUrl;
  },

  async cancel(shop) {
    const subscription = await this.findByShop(shop);
    if (_.isEmpty(subscription.data)) {
      return;
    }
    await super.update(subscription.data.id, { data: { status: 'CANCELLED' } });
  },

  async findOnShopify(id) {
    // get strapi request context
    const ctx = strapi.requestContext.get();
    // get shopify session
    const session = _.get(ctx, 'state.shopify.session');
    // get gid from numeric id
    const subscriptionGid = this.subscriptionIdToGid(id);
    // get graphql client
    const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);

    // get subscription from Shopify
    const subscription = await appSubscriptionFind(client, subscriptionGid);

    // parse response
    const utilsService = strapi.service('plugin::shopify.billing-utils');
    return utilsService.parseShopifySubscription(subscription);
  },

  async findByShop(shop) {
    const { results } = await this.find({
      where: { shop: { domain: { $eq: shop } } },
      sort: 'id:desc',
    });
    return {
      data: results[0] || {},
      meta: {},
    };
  },

  async hasSubscribed(shop) {
    const subscription = await this.findByShop(shop);
    if (_.isEmpty(subscription.data)) return false;
    if (subscription.data.status !== 'ACTIVE') return false;
    return true;
  },
}));

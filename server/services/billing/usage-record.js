'use strict';

const { createCoreService } = require('@strapi/strapi').factories;
const Shopify = require('@shopify/shopify-api').default;
const _ = require('lodash');
const { appUsageRecordCreate } = require('./graphql');

module.exports = createCoreService('plugin::shopify.usage-record', ({ strapi }) => ({
  usageRecordGidToId(gid) {
    return Number(gid.replace('gid://shopify/AppUsageRecord/', ''));
  },

  usageRecurdIdToGid(id) {
    return `gid://shopify/AppUsageRecord/${id}`;
  },

  async create(params) {
    // get strapi request context
    const ctx = strapi.requestContext.get();
    // get shopify session
    const session = _.get(ctx, 'state.shopify.session');
    // get subscription service
    const subscriptionService = strapi.service('plugin::shopify.subscription');
    // get db subscription
    const subscriptionDb = await subscriptionService.findByShop(session.shop);
    if (_.isEmpty(subscriptionDb.data)) throw new Error('Shop subscription not found');
    if (subscriptionDb.data.status !== 'ACTIVE') throw new Error('Shop subscription is not ACTIVE');
    // get shopify subscription
    const subscriptionShopify = await subscriptionService.findOnShopify(subscriptionDb.data.id);
    // get capped amount
    const cappedAmount = Number(_.get(subscriptionShopify, 'usage.cappedAmount.amount'));
    // get balance used
    const balanceUsed = Number(_.get(subscriptionShopify, 'usage.balanceUsed.amount'));
    // get usage price
    const price = Number(_.get(params, 'price'));
    // check if exceeds the capped usage
    if (balanceUsed + price >= cappedAmount) throw new Error('Usage capped amount exceeded');
    // set usage gid
    params.lineItemId = _.get(subscriptionShopify, 'usage.id');
    // get graphql client
    const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);

    // create usage record on Shopify
    const { usageRecordGid } = await appUsageRecordCreate(client, params);

    // get numeric id from gid
    const usageRecordId = this.usageRecordGidToId(usageRecordGid);
    // create usage record on db
    const result = await super.create({
      data: {
        id: usageRecordId,
        price,
        subscription: subscriptionDb.data.id,
      },
    });
    return result;
  },
}));

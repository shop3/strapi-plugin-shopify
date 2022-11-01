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
    const { shop, accessToken, ...usageRecord } = params;
    // get subscription service
    const subscriptionService = strapi.service('plugin::shopify.subscription');
    // get db subscription
    const subscriptionDb = await subscriptionService.findByShop(shop);
    if (_.isEmpty(subscriptionDb.data)) throw new Error('Shop subscription not found');
    if (subscriptionDb.data.status !== 'ACTIVE') throw new Error('Shop subscription is not ACTIVE');
    // get shopify subscription
    const subscriptionShopify = await subscriptionService.findOnShopify(subscriptionDb.data.id, { shop, accessToken });
    // get capped amount
    const cappedAmount = Number(_.get(subscriptionShopify, 'usage.cappedAmount.amount'));
    // get balance used
    const balanceUsed = Number(_.get(subscriptionShopify, 'usage.balanceUsed.amount'));
    // get usage price
    const price = Number(_.get(usageRecord, 'price'));
    // check if exceeds the capped usage
    if (balanceUsed + price >= cappedAmount) throw new Error('Usage capped amount exceeded');
    // set usage gid
    usageRecord.lineItemId = _.get(subscriptionShopify, 'usage.id');
    // get graphql client
    const client = new Shopify.Clients.Graphql(shop, accessToken);

    // create usage record on Shopify
    const { usageRecordGid } = await appUsageRecordCreate(client, usageRecord);

    // get numeric id from gid
    const usageRecordId = this.usageRecordGidToId(usageRecordGid);
    // create usage record on db
    const result = await super.create({
      data: {
        id: usageRecordId,
        subscription: subscriptionDb.data.id,
      },
    });
    return result;
  },
}));
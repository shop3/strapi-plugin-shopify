'use strict';

const Shopify = require('@shopify/shopify-api').default;
const _ = require('lodash');
const { appPurchaseCreate } = require('./graphql');

module.exports = ({ strapi }) => ({
  appPurchaseGidToId(gid) {
    return Number(gid.replace('gid://shopify/AppPurchaseOneTime/', ''));
  },

  appPurchaseIdToGid(id) {
    return `gid://shopify/AppPurchaseOneTime/${id}`;
  },

  async create(params) {
    const { planId, ...appPurchase } = params;
    // get strapi request context
    const ctx = strapi.requestContext.get();
    // get shop
    const shop = _.get(ctx, 'state.shopify.shop');
    // get shopify session
    const session = _.get(ctx, 'state.shopify.session');
    // get graphql client
    const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
    // create appPurchase on Shopify
    const { confirmationUrl, appPurchaseGid } = await appPurchaseCreate(client, appPurchase);
    
    // get numeric id from gid
    const appPurchaseId = this.appPurchaseGidToId(appPurchaseGid);
    // create appPurchase on db
    await strapi.query('plugin::shopify.app-purchase').create({
      data: {
        shopify_id: appPurchaseId,
        status: 'PENDING',
        test: appPurchase.test,
        name: appPurchase.name,
        price: appPurchase.price,
      },
    });
    return confirmationUrl;
  },
});

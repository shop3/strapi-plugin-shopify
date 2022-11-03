'use strict';

const Shopify = require('@shopify/shopify-api').default;
const { ApiVersion } = require('@shopify/shopify-api');
const _ = require('lodash');

module.exports = ({ strapi }) => ({
  getShopify() {
    return Shopify;
  },

  getApiVersion() {
    return ApiVersion.January22;
  },

  initializeContext() {
    const { apiKey, apiSecret, scopes, hostName, isEmbedded } = strapi.config.get('plugin.shopify');
    // get session service
    const session = strapi.service('plugin::shopify.session');
    // get api version
    const apiVersion = this.getApiVersion();
    // initialize shopify context
    Shopify.Context.initialize({
      API_KEY: apiKey,
      API_SECRET_KEY: apiSecret,
      SCOPES: scopes,
      HOST_NAME: hostName.replace('https://', ''),
      API_VERSION: apiVersion,
      IS_EMBEDDED_APP: isEmbedded,
      SESSION_STORAGE: new Shopify.Session.CustomSessionStorage(
        session.storeSession,
        session.loadSession,
        session.deleteSession
      ),
    });
    strapi.log.info('Shopify context initialized');
  },

  initializeWebhooks() {
    // get webhooks service
    const webhooks = strapi.service('plugin::shopify.webhooks');
    // create handlers from webhooks service
    let handlers = {};
    for (const [topic, webhookHandler] of Object.entries(webhooks)) {
      handlers[topic] = {
        path: '/api/shopify/webhooks',
        webhookHandler,
      };
    }
    // add handlers to the registry
    Shopify.Webhooks.Registry.addHandlers(handlers);
    strapi.log.info('Shopify webhooks initialized');
  },

  async registerWebhooks(shop, accessToken) {
    const results = await Shopify.Webhooks.Registry.registerAll({
      shop,
      accessToken,
    });
    for (const [topic, result] of Object.entries(results)) {
      if (!result.success) {
        strapi.log.error(`Failed to register webhook ${topic}`);
      }
    }
  },

  async getClientRest() {
    const ctx = strapi.requestContext.get();
    const session = _.get(ctx, 'state.shopify.session');
    if (session) {
      const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
      return client;
    } else {
      throw new Error('Shopify session is undefined');
    }
  },

  async getClientRestOffline(shop) {
    const session = await Shopify.Utils.loadOfflineSession(shop);
    if (session) {
      const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
      return client;
    } else {
      throw new Error('Shopify session is undefined');
    }
  },

  async getClientGraphql() {
    const ctx = strapi.requestContext.get();
    const session = _.get(ctx, 'state.shopify.session');
    if (session) {
      const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
      return client;
    } else {
      throw new Error('Shopify session is undefined');
    }
  },

  async getClientGraphqlOffline(shop) {
    const session = await Shopify.Utils.loadOfflineSession(shop);
    if (session) {
      const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
      return client;
    } else {
      throw new Error('Shopify session is undefined');
    }
  },
});

'use strict';

const Shopify = require('@shopify/shopify-api').default;
const { ShopifyHeader } = require('@shopify/shopify-api');
const _ = require('lodash');

module.exports = ({ strapi }) => ({
  async index(ctx) {
    // get query and query params
    const { query } = ctx;
    const { shop, host, locale } = query;

    const session = Shopify.Context.IS_EMBEDDED_APP
      ? query.session
      : await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res, true);

    if (session) {
      const redirectUrl = strapi.config.get('plugin.shopify.redirectUrl');
      const utils = strapi.service('plugin::shopify.utils');
      ctx.redirect(`${redirectUrl}?${utils.generateQuery({ shop, host, locale })}`);
    } else {
      const installed = await strapi.service('plugin::shopify.shop').installed(shop);
      const utils = strapi.service('plugin::shopify.utils');
      if (!installed) {
        ctx.redirect(`/api/shopify/install?${utils.generateQuery({ shop })}`);
      } else {
        ctx.redirect(`/api/shopify/auth?${utils.generateQuery({ shop })}`);
      }
    }
  },

  async webhooks(ctx) {
    if (Shopify.Webhooks.Registry.isWebhookPath(ctx.path)) {
      const topic = ctx.get(ShopifyHeader.Topic);
      const domain = ctx.get(ShopifyHeader.Domain);
      const graphqlTopic = topic.toUpperCase().replace(/\//g, '_');
      const handler = Shopify.Webhooks.Registry.getHandler(graphqlTopic);
      try {
        await handler.webhookHandler(graphqlTopic, domain, ctx.request.body);
        ctx.send({
          message: 'ok',
        });
      } catch (err) {
        ctx.throw(500, 'Failed to execute the webhook.');
      }
    } else {
      ctx.throw(404, 'Webhook not found.');
    }
  },

  async me(ctx) {
    const session = _.get(ctx, 'state.shopify.session');
    if (session) {
      ctx.send(session.onlineAccessInfo.associated_user);
    } else {
      ctx.throw(404, 'Session not found');
    }
  },
});

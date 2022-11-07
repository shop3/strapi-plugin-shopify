'use strict';

const Shopify = require('@shopify/shopify-api').default;
const { ShopifyHeader } = require('@shopify/shopify-api');
const _ = require('lodash');

module.exports = ({ strapi }) => ({
  async index(ctx) {
    // get query and query params
    const { query } = ctx;
    const { shop, host, locale } = query;

    // handle embedded app session
    if (Shopify.Context.IS_EMBEDDED_APP && query.session) {
      const redirectUrl = strapi.config.get('plugin.shopify.redirectUrl');
      const utils = strapi.service('plugin::shopify.utils');
      ctx.redirect(`${redirectUrl}?${utils.generateQuery({ shop, host, locale })}`);
      return;
    }

    // handle non embedded app session
    const session = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res, true);

    // if session is undefined the request was not authenticated
    if (!session) {
      // check if the shop was already installed
      const installed = await strapi.service('plugin::shopify.shop').installed(shop);
      // get utils service
      const utils = strapi.service('plugin::shopify.utils');
      // redirect to install or auth
      if (!installed) {
        ctx.redirect(`/api/shopify/install?${utils.generateQuery({ shop })}`);
      } else {
        ctx.redirect(`/api/shopify/auth?${utils.generateQuery({ shop })}`);
      }
      return;
    }

    // if session is defined the request was authenticated
    // check if request uses another shop in query string
    if (query.shop && query.shop !== session.shop) {
      await Shopify.Utils.deleteCurrentSession(ctx.req, ctx.res, true);
      strapi.log.warn(`Redirect shop ${shop}: Different shop in query string`);
      ctx.redirect(`/api/shopify/auth?${utils.generateQuery({ shop })}`);
      return;
    }
    // check if session has access token
    if (!session.accessToken) {
      await Shopify.Utils.deleteCurrentSession(ctx.req, ctx.res, true);
      strapi.log.warn(`Redirect shop ${shop}: Missing access token`);
      ctx.redirect(`/api/shopify/auth?${utils.generateQuery({ shop })}`);
      return;
    }
    // check if session has expired
    if (session.expires < new Date()) {
      await Shopify.Utils.deleteCurrentSession(ctx.req, ctx.res, true);
      strapi.log.warn(`Redirect shop ${shop}: Session expired`);
      ctx.redirect(`/api/shopify/auth?${utils.generateQuery({ shop })}`);
      return;
    }
    // check if scope has changed
    const scopesChanged = !Shopify.Context.SCOPES.equals(session.scope);
    if (scopesChanged) {
      await Shopify.Utils.deleteCurrentSession(ctx.req, ctx.res, true);
      strapi.log.warn(`Redirect shop ${shop}: Session scope has changed`);
      ctx.redirect(`/api/shopify/install?${utils.generateQuery({ shop })}`);
      return;
    }
    // redirect to home
    const redirectUrl = strapi.config.get('plugin.shopify.redirectUrl');
    const utils = strapi.service('plugin::shopify.utils');
    ctx.redirect(`${redirectUrl}?${utils.generateQuery({ shop, host, locale })}`);
    return;
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

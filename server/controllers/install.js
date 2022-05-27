'use strict';

const Shopify = require('@shopify/shopify-api').default;

module.exports = ({ strapi }) => ({
  async init(ctx) {
    try {
      const { shop } = ctx.query;
      // begin authentication
      const authRoute = await Shopify.Auth.beginAuth(ctx.req, ctx.res, shop, '/api/shopify/install/callback', false);
      // redirect to returned url
      ctx.redirect(authRoute);
    } catch (e) {
      if (e instanceof Shopify.Errors.ShopifyError) {
        ctx.throw(500, e.message);
      } else {
        ctx.throw(500, `Failed to complete OAuth installation process: ${e.message}`);
      }
    }
  },

  async callback(ctx) {
    const { query } = ctx;
    // validate authentication callback
    const session = await Shopify.Auth.validateAuthCallback(ctx.req, ctx.res, query);
    const { shop, accessToken } = session;
    // install shop
    await strapi.service('plugin::shopify.shop').install(shop, accessToken);
    // register webhooks
    await strapi.service('plugin::shopify.shopify').registerWebhooks(shop, accessToken);
    // redirect to authentication
    const utils = strapi.service('plugin::shopify.utils');
    ctx.redirect(`/api/shopify/auth?${utils.generateQuery({ shop })}`);
  },
});

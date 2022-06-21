'use strict';

const Shopify = require('@shopify/shopify-api').default;

module.exports = ({ strapi }) => ({
  async init(ctx) {
    try {
      const { shop } = ctx.query;
      // begin authentication
      const authRoute = await Shopify.Auth.beginAuth(ctx.req, ctx.res, shop, '/api/shopify/auth/callback', true);
      // redirect to returned url
      ctx.redirect(authRoute);
    } catch (e) {
      if (e instanceof Shopify.Errors.ShopifyError) {
        ctx.throw(500, e.message);
      } else {
        ctx.throw(500, `Failed to complete OAuth authentication process: ${e.message}`);
      }
    }
  },

  async callback(ctx) {
    const { query } = ctx;
    const { shop, host } = query;
    // validate authentication callback
    await Shopify.Auth.validateAuthCallback(ctx.req, ctx.res, query);
    // redirect to app url
    const redirectUrl = strapi.config.get('plugin.shopify.redirectUrl');
    const utils = strapi.service('plugin::shopify.utils');
    ctx.redirect(`${redirectUrl}?${utils.generateQuery({ shop, host })}`);
  },

  async logout(ctx) {
    const result = await Shopify.Utils.deleteCurrentSession(ctx.req, ctx.res, true);
    return {
      success: result,
    };
  },
});

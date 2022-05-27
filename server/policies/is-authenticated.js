'use strict';

module.exports = (ctx, config, { strapi }) => {
  if (ctx.state.shopify) {
    return true;
  }
  return false;
};

'use strict';

module.exports = ({ strapi }) => ({
  async read(ctx) {
    const config = strapi.config.get('plugin.shopify');
    ctx.send(config);
  },
});

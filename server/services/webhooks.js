'use strict';

module.exports = ({ strapi }) => ({
  SHOP_UPDATE: async (topic, shop, body) => {
    const shopService = strapi.service('plugin::shopify.shop');
    await shopService.update(body.id, body);
  },
  // "SHOP_REDACT": (topic, shop, body) => {

  // },
  APP_UNINSTALLED: async (topic, shop, body) => {
    const shopService = strapi.service('plugin::shopify.shop');
    await shopService.uninstall(shop);
  },
});

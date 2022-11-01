'use strict';

const disableBilling = process.env.SHOPIFY_DISABLE_BILLING === 'true';

module.exports = ({ strapi }) => ({
  SHOP_UPDATE: async (topic, shop, body) => {
    const shopService = strapi.service('plugin::shopify.shop');
    await shopService.update(body.id, body);
  },

  APP_UNINSTALLED: async (topic, shop, body) => {
    const shopService = strapi.service('plugin::shopify.shop');
    await shopService.uninstall(shop);
  },

  APP_SUBSCRIPTIONS_UPDATE: !disableBilling ? async (topic, shop, body) => {
    const subscriptionService = strapi.service('plugin::shopify.subscription');
    const gid = body.app_subscription.admin_graphql_api_id;
    const id = subscriptionService.subscriptionGidToId(gid);
    const status = body.app_subscription.status;
    await subscriptionService.update(id, { data: { status } });
    strapi.log.info(`Subscription ${id} updated successfully`);
  } : undefined,
});

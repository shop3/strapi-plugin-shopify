'use strict';

module.exports = ({ strapi }) => ({
  async initialize() {
    const shopifyLifecycles = strapi.service('plugin::shopify.lifecycles');
    shopifyLifecycles.subscribe({
      afterUninstall: async (shop) => {
        // get subscription service
        const subscriptionService = strapi.service('plugin::shopify.subscription');
        // cancel subscription
        await subscriptionService.cancel(shop);
      },
    });
  },
});

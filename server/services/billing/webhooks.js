'use strict';

const disableBilling = process.env.SHOPIFY_DISABLE_BILLING === 'true';

const enabledExport = ({ strapi }) => ({
  APP_SUBSCRIPTIONS_UPDATE: async (topic, shop, body) => {
    const subscriptionService = strapi.service('plugin::shopify.subscription');
    const gid = body.app_subscription.admin_graphql_api_id;
    const id = subscriptionService.subscriptionGidToId(gid);
    const status = body.app_subscription.status;
    await subscriptionService.update(id, { data: { status } });
    strapi.log.info(`Subscription ${id} updated successfully`);
  },
});

module.exports = ({ strapi }) => (!disableBilling ? enabledExport({ strapi }) : {});

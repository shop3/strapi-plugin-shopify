'use strict';

const disableBilling = process.env.SHOPIFY_DISABLE_BILLING === 'true';

const enabledExport = ({ strapi }) => ({
  APP_SUBSCRIPTIONS_UPDATE: async (topic, shop, body) => {
    const subscriptionService = strapi.service('plugin::shopify.subscription');
    const gid = body.app_subscription.admin_graphql_api_id;
    const id = subscriptionService.subscriptionGidToId(gid);
    const status = body.app_subscription.status;
    const lifecycles = strapi.service('plugin::shopify.lifecycles');
    // run before subscribe lifecycles
    if (status === 'ACTIVE') await lifecycles.run('beforeSubscribe', shop);
    // update subscription
    await strapi.db.query('plugin::shopify.subscription').update({where: {shopify_id: id }, data: { status: status }});
    // run after subscribe lifecycles
    if (status === 'ACTIVE') await lifecycles.run('afterSubscribe', shop);
    strapi.log.info(`Subscription ${id} updated successfully to ${status}`);
  },
  APP_PURCHASES_ONE_TIME_UPDATE: async (topic, shop, body) => {
    const appPurchaseService = strapi.service('plugin::shopify.appPurchase');
    const gid = body.app_purchase_one_time.admin_graphql_api_id;
    const id = appPurchaseService.appPurchaseGidToId(gid);
    const status = body.app_purchase_one_time.status;
    const lifecycles = strapi.service('plugin::shopify.lifecycles');
    // run before subscribe lifecycles
    if (status === 'ACTIVE') await lifecycles.run('beforeSubscribe', shop);
    // update subscription
    await strapi.db.query('plugin::shopify.app-purchase').update({where: {shopify_id: id }, data: { status: status }});
    // run after subscribe lifecycles
    if (status === 'ACTIVE') await lifecycles.run('afterSubscribe', shop);
    strapi.log.info(`app_purchase_one_time ${id} updated successfully to ${status}`);
  },
});

module.exports = ({ strapi }) => (!disableBilling ? enabledExport({ strapi }) : {});

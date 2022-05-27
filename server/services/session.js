'use strict';

const Shopify = require('@shopify/shopify-api').default;

module.exports = ({ strapi }) => ({
  async storeSession(session) {
    try {
      // get session
      const sessionDb = await strapi.db.query('plugin::shopify.session').findOne({ where: { uid: session.id } });
      // create or update session
      if (!sessionDb) {
        await strapi.db.query('plugin::shopify.session').create({
          data: {
            uid: session.id,
            shop: session.shop,
            state: session.state,
            scope: session.scope,
            expires: session.expires || null,
            isOnline: session.isOnline,
            accessToken: session.accessToken,
            onlineAccessInfo: session.onlineAccessInfo,
          },
        });
        strapi.log.info(`Shopify session ${session.id} created`);
      } else {
        await strapi.db.query('plugin::shopify.session').update({
          where: { id: sessionDb.id },
          data: {
            uid: session.id,
            shop: session.shop,
            state: session.state,
            scope: session.scope,
            expires: session.expires || null,
            isOnline: session.isOnline,
            accessToken: session.accessToken,
            onlineAccessInfo: session.onlineAccessInfo,
          },
        });
        strapi.log.info(`Shopify session ${session.id} updated`);
      }
      return true;
    } catch (e) {
      strapi.log.error(e.message);
      return false;
    }
  },

  async loadSession(id) {
    const sessionDb = await strapi.db.query('plugin::shopify.session').findOne({ where: { uid: id } });
    if (sessionDb) {
      const session = new Shopify.Session.Session(id);
      session.shop = sessionDb.shop;
      session.state = sessionDb.state;
      session.scope = sessionDb.scope;
      session.expires = sessionDb.expires;
      session.isOnline = sessionDb.isOnline;
      session.accessToken = sessionDb.accessToken;
      session.onlineAccessInfo = sessionDb.onlineAccessInfo;
      return session;
    }
  },

  async deleteSession(id) {
    try {
      await strapi.db.query('plugin::shopify.session').delete({ where: { uid: id } });
      strapi.log.info(`Shopify session ${id} deleted`);
      return true;
    } catch (e) {
      strapi.log.error(e.message);
      return false;
    }
  },

  async deleteShopSessions(shop) {
    try {
      await strapi.db.query('plugin::shopify.session').deleteMany({ where: { shop: shop } });
      strapi.log.info(`Shopify sessions deleted for shop ${shop}`);
      return true;
    } catch (e) {
      strapi.log.error(e.message);
      return false;
    }
  },

  async deleteExpiredSessions() {
    try {
      const { count } = await strapi.db
        .query('plugin::shopify.session')
        .deleteMany({ where: { expires: { $lt: new Date() } } });
      if (count > 0) {
        strapi.log.info(`Shopify deleted ${count} expired sessions`);
      }
      return true;
    } catch (e) {
      strapi.log.error(e.message);
      return false;
    }
  },

  async deleteTemporarySessions() {
    try {
      const { count } = await strapi.db
        .query('plugin::shopify.session')
        .deleteMany({ where: { accessToken: { $null: true } } });
      if (count > 0) {
        strapi.log.info(`Shopify deleted ${count} temporary sessions`);
      }
      return true;
    } catch (e) {
      strapi.log.error(e.message);
      return false;
    }
  },
});

'use strict';

const Shopify = require('@shopify/shopify-api').default;
const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('plugin::shopify.shop', ({ strapi }) => ({
  async findByDomain(shop) {
    const shopDb = await strapi.db.query('plugin::shopify.shop').findOne({ where: { domain: shop } });
    return shopDb;
  },

  async create(...args) {
    let shop, props, token;
    if (typeof args[0] === 'string' && typeof args[1] === 'string') {
      [shop, token] = args;
    } else if (typeof args[0] === 'object') {
      [props, token] = args;
      shop = props.domain;
    }
    if (typeof shop === 'string' && typeof token === 'string') {
      // get shop data
      const client = new Shopify.Clients.Rest(shop, token);
      const response = await client.get({ path: 'shop' });
      // assing shop
      props = { ...response.body.shop, ...props };
    }
    // create shop
    return strapi.db.query('plugin::shopify.shop').create({ data: props });
  },

  async update(...args) {
    let id, shop, props, token;
    if (typeof args[0] === 'string' && typeof args[1] === 'string') {
      [shop, token] = args;
    } else if (typeof args[0] === 'number' && typeof args[1] === 'object') {
      [id, props, token] = args;
      shop = props.domain;
    }
    if (typeof shop === 'string' && typeof token === 'string') {
      // get shop data
      const client = new Shopify.Clients.Rest(shop, token);
      const response = await client.get({ path: 'shop' });
      // assing shop
      id = response.body.shop.id;
      props = { ...response.body.shop, ...props };
    }
    // update shop
    return strapi.db.query('plugin::shopify.shop').update({ where: { id }, data: props });
  },

  async install(shop, token) {
    try {
      const shopDb = await strapi.db.query('plugin::shopify.shop').findOne({ where: { domain: shop } });
      const lifecycles = strapi.service('plugin::shopify.lifecycles');
      await lifecycles.run('beforeInstall', shop);
      if (!shopDb) {
        await this.create({ domain: shop, installed: true }, token);
      } else {
        await this.update(shopDb.id, { domain: shop, installed: true }, token);
      }
      await lifecycles.run('afterInstall', shop);
      strapi.log.info(`Shop ${shop} installed successfully`);
    } catch (e) {
      strapi.log.error(`Failed to install ${shop} - ${e.message}`);
    }
  },

  async uninstall(shop) {
    try {
      const shopDb = await strapi.db.query('plugin::shopify.shop').findOne({ where: { domain: shop } });
      if (!shopDb) {
        strapi.log.error(`Shop ${shop} not found`);
      } else {
        const lifecycles = strapi.service('plugin::shopify.lifecycles');
        await lifecycles.run('beforeUninstall', shop);
        await this.update(shopDb.id, { domain: shop, installed: false });
        await lifecycles.run('afterUninstall', shop);
        await strapi.service('plugin::shopify.session').deleteShopSessions(shop);
        strapi.log.info(`Shop ${shop} uninstalled successfully`);
      }
    } catch (e) {
      strapi.log.error(`Failed to uninstall ${shop} - ${e.message}`);
    }
  },

  async installed(shop) {
    try {
      const session = await Shopify.Utils.loadOfflineSession(shop);
      const shopDb = await strapi.db.query('plugin::shopify.shop').findOne({ where: { domain: shop } });
      return session && shopDb && shopDb.installed;
    } catch (e) {
      strapi.log.error(`Failed to check if is installed ${shop} - ${e.message}`);
    }
  },
}));

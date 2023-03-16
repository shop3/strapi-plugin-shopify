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
    // replace id
    const { id: shopify_id, ...shopData } = props;
    props = { ...shopData, shopify_id };
    // create shop
    return strapi.db.query('plugin::shopify.shop').create({ data: props });
  },

  async update(...args) {
    let shop, props, token;
    if (typeof args[0] === 'string' && typeof args[1] === 'string') {
      [shop, token] = args;
    } else if (typeof args[0] === 'string' && typeof args[1] === 'object') {
      [shop, props, token] = args;
    }
    if (typeof shop === 'string' && typeof token === 'string') {
      // get shop data
      const client = new Shopify.Clients.Rest(shop, token);
      const response = await client.get({ path: 'shop' });
      // assing shop
      props = { ...response.body.shop, ...props };
    }
    // replace id
    const { id: shopify_id, ...shopData } = props;
    props = { ...shopData, shopify_id };
    // update shop
    return strapi.db.query('plugin::shopify.shop').update({ where: { domain: { $eq: shop } }, data: props });
  },

  async install(shop, token) {
    try {
      const shopDb = await strapi.db.query('plugin::shopify.shop').findOne({ where: { domain: shop } });
      const lifecycles = strapi.service('plugin::shopify.lifecycles');
      await lifecycles.run('beforeInstall', shop);
      if (!shopDb) {
        await this.create({ domain: shop, installed: true }, token);
      } else {
        await this.update(shop, { domain: shop, installed: true }, token);
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
        await this.update(shop, { domain: shop, installed: false });
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

  async redact(shop) {
    try {
      const shopModel = strapi.plugins.shopify.contentType('shop');
      const shopAttributes = Object.keys(shopModel.attributes).filter(x => {
        const keepAttributesList = [
          'shopify_id',
          'domain',
          'email',
          'installed',
          'createdAt',
          'updatedAt',
          'createdBy',
          'updatedBy',
        ];
        return !keepAttributesList.includes(x)
      });
      await strapi.db.query('plugin::shopify.shop').update({ where: { domain: { $eq: shop } }, data: shopAttributes.reduce((acc, curr) => ({ ...acc, [curr]: null }), {}) });
    } catch (e) {
      strapi.log.error(`Failed to redact ${shop} - ${e.message}`);
    }
  }
}));

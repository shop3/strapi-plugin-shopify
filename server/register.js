'use strict';

const authStrategy = require('./strategies/shopify-auth');

module.exports = ({ strapi }) => {
  strapi.container.get('auth').register('content-api', authStrategy);
};

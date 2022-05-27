'use strict';

const config = require('./config');
const register = require('./register');
const bootstrap = require('./bootstrap');
const contentTypes = require('./content-types');
const routes = require('./routes');
const policies = require('./policies');
const controllers = require('./controllers');
const services = require('./services');

module.exports = () => ({
  config,
  register,
  bootstrap,
  contentTypes,
  routes,
  policies,
  controllers,
  services,
});

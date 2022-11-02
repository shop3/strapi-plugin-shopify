'use strict';

const mutations = require('./mutations');
const queries = require('./queries');

module.exports = {
  ...mutations,
  ...queries,
};

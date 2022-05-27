'use strict';

const isAuthenticated = require('./is-authenticated');
const validBodyHmac = require('./valid-body-hmac');
const validEntryPoint = require('./valid-entry-point');
const validQueryHmac = require('./valid-query-hmac');

module.exports = {
  'is-authenticated': isAuthenticated,
  'valid-body-hmac': validBodyHmac,
  'valid-entry-point': validEntryPoint,
  'valid-query-hmac': validQueryHmac,
};

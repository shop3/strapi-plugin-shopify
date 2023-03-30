'use strict';

const shop = require('./Shop');
const session = require('./Session');
const billing = require('./Billing');
const dailyReport = require('./DailyReport');

module.exports = {
  session,
  shop,
  ...billing,
  'daily-report': dailyReport,
};

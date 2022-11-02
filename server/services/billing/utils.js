'use strict';

const _ = require('lodash');

module.exports = () => ({
  parseShopifySubscription(body) {
    const { lineItems, ...subscription } = _.get(body, 'data.node', {});
    for (const line of lineItems) {
      const { __typename, ...pricingDetails } = _.get(line, 'plan.pricingDetails', {});
      switch (__typename) {
        case 'AppRecurringPricing':
          subscription.recurring = {
            id: line.id,
            ...pricingDetails,
          };
          break;
        case 'AppUsagePricing':
          subscription.usage = {
            id: line.id,
            ...pricingDetails,
          };
          break;
        default:
          break;
      }
    }
    return subscription;
  },

  getRemainingTrialDays(trialEndsOn) {
    const endTime = new Date(trialEndsOn).getTime();
    const nowTime = Math.floor(Date.now() / 86400000) * 86400000;
    if (endTime < nowTime) return 0;
    return Math.round((endTime - nowTime) / 86400000);
  },

  calculateTrialEndsOn(trialDays) {
    if (!trialDays || trialDays === 0) return null;
    return formatDate(new Date(Date.now() + trialDays * 86400000));
  },
});

function formatDate(date) {
  return new Date(date).toISOString().split('T')[0];
}

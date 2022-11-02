'use strict';

const _ = require('lodash');

/**
 * @param {Object} client
 * @param {string} subscriptionId
 *
 * @returns {Promise}
 */

module.exports = async (client, subscriptionId) => {
  const variables = {
    id: subscriptionId,
  };
  const { body } = await client.query({
    data: {
      query,
      variables,
    },
  });
  const clientErrors = _.get(body, 'errors', []);
  if (clientErrors.length > 0) {
    clientErrors.forEach((e) => strapi.log.error(e.message));
    throw new Error('Failed to find the subscription');
  }
  return body;
};

const query = `
query appSubscription($id: ID!) {
  node(id: $id) {
    ...on AppSubscription {
      id
      name
      status
      test
      trialDays
      currentPeriodEnd
      lineItems {
        id
        plan {
          pricingDetails {
            ...on AppRecurringPricing {
              __typename
              interval
              price {
                amount
                currencyCode
              }
            }
            ...on AppUsagePricing {
              __typename
              terms
              interval
              cappedAmount {
                amount
                currencyCode
              }
              balanceUsed {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
}`;

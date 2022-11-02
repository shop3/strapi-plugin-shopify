'use strict';

const _ = require('lodash');

/**
 * @param {Object} client
 * @param {Object} params
 * @param {string} params.name
 * @param {string} params.returnUrl
 * @param {number} params.trialDays
 * @param {string} params.currencyCode
 * @param {Object} [params.recurring]
 * @param {number} params.recurring.price
 * @param {string} params.recurring.interval
 * @param {Object} [params.usage]
 * @param {string} params.usage.terms
 * @param {number} params.usage.cappedAmount
 * @param {boolean} params.test
 *
 * @returns {Promise}
 */

module.exports = async (client, params) => {
  const variables = {
    name: params.name,
    returnUrl: params.returnUrl,
    trialDays: params.trialDays,
    test: params.test,
    lineItems: calculateLineItems(params),
  };
  const { body } = await client.query({
    data: {
      query,
      variables,
    },
  });
  // check graphql client errors
  const clientErrors = _.get(body, 'errors', []);
  if (clientErrors.length > 0) {
    clientErrors.forEach((e) => strapi.log.error(e.message));
    throw new Error('Failed to complete the subscription');
  }
  // check graphql user errors
  const userErrors = _.get(body, 'data.appSubscriptionCreate.userErrors', []);
  if (userErrors.length > 0) {
    userErrors.forEach((e) => strapi.log.error(e.message));
    throw new Error('Failed to complete the subscription');
  }
  // get confirmation url
  const confirmationUrl = _.get(body, 'data.appSubscriptionCreate.confirmationUrl');
  // get subscription id
  const subscriptionGid = _.get(body, 'data.appSubscriptionCreate.appSubscription.id');
  // return values
  return { confirmationUrl, subscriptionGid };
};

const query = `
mutation appSubscriptionCreate(
  $name: String!
  $returnUrl: URL!
  $trialDays: Int
  $test: Boolean
  $lineItems: [AppSubscriptionLineItemInput!]!
) {
  appSubscriptionCreate(
    name: $name
    returnUrl: $returnUrl
    trialDays: $trialDays
    test: $test
    lineItems: $lineItems
  ) {
    userErrors {
      field
      message
    }
    confirmationUrl
    appSubscription {
      id
    }
  }
}`;

function calculateLineItems({ recurring, usage, currencyCode }) {
  const lineItems = [];
  if (recurring) {
    lineItems.push({
      plan: {
        appRecurringPricingDetails: {
          price: { amount: recurring.price, currencyCode },
          interval: recurring.interval,
        },
      },
    });
  }
  if (usage) {
    if (recurring.interval === 'ANNUAL') {
      strapi.log.error("Annual subscriptions don't support usage billing");
      return lineItems;
    }
    lineItems.push({
      plan: {
        appUsagePricingDetails: {
          terms: usage.terms,
          cappedAmount: { amount: usage.cappedAmount, currencyCode },
        },
      },
    });
  }
  return lineItems;
}

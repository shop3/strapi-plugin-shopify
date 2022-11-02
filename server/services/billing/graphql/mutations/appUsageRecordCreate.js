'use strict';

const _ = require('lodash');

/**
 * @param {Object} client
 * @param {Object} params
 * @param {string} params.lineItemId
 * @param {string} params.description
 * @param {number} params.price
 * @param {string} params.currencyCode
 *
 * @returns {Promise}
 */

module.exports = async (client, params) => {
  const variables = {
    subscriptionLineItemId: params.lineItemId,
    description: params.description,
    price: { amount: params.price, currencyCode: params.currencyCode },
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
    throw new Error('Failed to create usage record');
  }
  // check graphql user errors
  const userErrors = _.get(body, 'data.appUsageRecordCreate.userErrors', []);
  if (userErrors.length > 0) {
    userErrors.forEach((e) => strapi.log.error(e.message));
    throw new Error('Failed to create usage record');
  }
  // get usage record id
  const usageRecordGid = _.get(body, 'data.appUsageRecordCreate.appUsageRecord.id');
  // return values
  return { usageRecordGid };
};

const query = `
mutation appUsageRecordCreate(
  $subscriptionLineItemId: ID!
  $description: String!
  $price: MoneyInput!
) {
  appUsageRecordCreate(
    subscriptionLineItemId: $subscriptionLineItemId
    description: $description
    price: $price
  ) {
    userErrors {
      field
      message
    }
    appUsageRecord {
      id
    }
  }
}`;

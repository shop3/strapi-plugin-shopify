'use strict';

const _ = require('lodash');

/**
 * @param {Object} client
 * @param {string} subscriptionId
 * @param {Object} params
 * @param {string} params.numItems
 * @param {string} params.cursor
 *
 * @returns {Promise}
 */

module.exports = async (client, subscriptionId, params) => {
  const variables = {
    id: subscriptionId,
    numItems: params.numItems,
    cursor: params.cursor,
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
    throw new Error('Failed to find subscription usage records');
  }
  return body;
};

const query = `
query appSubscriptionUsageRecords(
  $id: ID!
  $numItems: Int!
  $cursor: String
) {
  node(id: $id) {
    ...on AppSubscription {
      id
      lineItems {
        id
        usageRecords(
          first: $numItems
          cursor: $cursor
          reverse: true
        ) {
          edges {
            cursor
            node {
              id
              createdAt
              description
              price {
                amount
                currencyCode
              }
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
        }
      }
    }
  }
}`;

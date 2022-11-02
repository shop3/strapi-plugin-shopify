'use strict';

const _ = require('lodash');

/**
 * @param {Object} client
 * @param {string} usageRecordId
 *
 * @returns {Promise}
 */

module.exports = async (client, usageRecordId) => {
  const variables = {
    id: usageRecordId,
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
    throw new Error('Failed to find the usage record');
  }
  return body;
};

const query = `
query appUsageRecord($id: ID!) {
  node(id: $id) {
    ...on AppUsageRecord {
      id
      createdAt
      description
      price {
        amount
        currencyCode
      }
    }
  }
}`;

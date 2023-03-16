'use strict';

const _ = require('lodash');

/**
 * @param {Object} client
 * @param {Object} params
 * @param {string} params.name
 * @param {number} params.price
 * @param {string} params.currencyCode
 * @param {string} params.returnUrl
 * @param {boolean} params.test
 *
 * @returns {Promise}
 */

module.exports = async (client, params) => {
  const variables = {
    name: params.name,
    price: { amount: params.price, currencyCode: params.currencyCode },
    returnUrl: params.returnUrl,
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
    throw new Error('Failed to complete the appPurchase');
  }
  // check graphql user errors
  const userErrors = _.get(body, 'data.appPurchaseCreate.userErrors', []);
  if (userErrors.length > 0) {
    userErrors.forEach((e) => strapi.log.error(e.message));
    throw new Error('Failed to complete the appPurchase');
  }
  // get confirmation url
  const confirmationUrl = _.get(body, 'data.appPurchaseOneTimeCreate.confirmationUrl');
  // get appPurchase id
  const appPurchaseGid = _.get(body, 'data.appPurchaseOneTimeCreate.appPurchaseOneTime.id');
  // return values
  return { confirmationUrl, appPurchaseGid };
};

const query = `
mutation 	appPurchaseOneTimeCreate(
  $name: String!
  $price: MoneyInput!
  $returnUrl: URL!
) {
  appPurchaseOneTimeCreate(
    name: $name
    price: $price
    returnUrl: $returnUrl
  ) {
    userErrors {
      field
      message
    }
    confirmationUrl
    appPurchaseOneTime {
      id
    }
  }
}`;

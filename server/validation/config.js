'use strict';

const { yup, validateYupSchemaSync } = require('@strapi/utils');
const { ApiVersion } = require('@shopify/shopify-api');

const configSchema = yup.object().shape({
  hostName: yup.string().required(),
  apiVersion: yup.string().oneOf(Object.values(ApiVersion)),
  apiKey: yup.string().required(),
  apiSecret: yup.string().required(),
  scopes: yup.array().of(yup.string()).required(),
  isEmbedded: yup.boolean().required(),
  redirectUrl: yup.string().url().required(),
});

module.exports = {
  validateConfig: validateYupSchemaSync(configSchema),
};

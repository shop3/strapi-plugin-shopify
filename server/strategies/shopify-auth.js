'use strict';

const Shopify = require('@shopify/shopify-api').default;
// const { ForbiddenError, UnauthorizedError } = require('@strapi/utils').errors;

const REAUTH_HEADER = 'X-Shopify-API-Request-Failure-Reauthorize';
const REAUTH_URL_HEADER = 'X-Shopify-API-Request-Failure-Reauthorize-Url';

const handleRedirectInstall = (ctx, shop, error) => {
  return handleRedirect(ctx, shop, 'install', error);
};

const handleRedirectAuth = (ctx, shop, error) => {
  return handleRedirect(ctx, shop, 'auth', error);
};

const generateRedirectUrl = (shop, action) => {
  const utils = strapi.service('plugin::shopify.utils');
  return `/api/shopify/${action}?${utils.generateQuery({ shop })}`;
};

const handleRedirect = (ctx, shop, action, error) => {
  if (ctx.request.type === 'text/html') {
    ctx.redirect(generateRedirectUrl(shop, action));
  } else {
    ctx.response.set(REAUTH_HEADER, '1');
    ctx.response.set(REAUTH_URL_HEADER, generateRedirectUrl(shop, action));
  }
  return { error };
};

const authenticate = async (ctx) => {
  try {
    // load current session
    const session = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res, true);
    // if session is undefined the request was not authenticated
    if (!session) return { authenticated: false };

    // check if request uses another shop in query string
    const { query } = ctx;
    if (query.shop && query.shop !== session.shop) {
      await Shopify.Utils.deleteCurrentSession(ctx.req, ctx.res, true);
      return handleRedirectAuth(ctx, query.shop, 'Different shop in query string');
    }

    // check if scope has changed
    const scopesChanged = !Shopify.Context.SCOPES.equals(session.scope);
    if (scopesChanged) {
      await Shopify.Utils.deleteCurrentSession(ctx.req, ctx.res, true);
      return handleRedirectInstall(ctx, session.shop, 'Session scope has changed');
    }

    // check if session has access token and is not expired
    if (session.accessToken && session.expires >= new Date()) {
      // set shopify session in context state
      ctx.state.shopify = session;
      // return authenticated session
      return {
        authenticated: true,
        credentials: session,
      };
    } else {
      // session has not access token or is expired
      await Shopify.Utils.deleteCurrentSession(ctx.req, ctx.res, true);
      const error = session.accessToken ? 'Missing access token' : 'Session expired';
      return handleRedirectAuth(ctx, session.shop, error);
    }
  } catch (err) {
    // return not authenticated
    return {
      authenticated: false,
    };
  }
};

// const verify = async (auth, config) => {
//   const { credentials: session } = auth;
// };

module.exports = {
  name: 'shopify-auth',
  authenticate,
  // verify,
};

'use strict';

module.exports = () => ({
  _subscribers: Object.fromEntries(actions.map((action) => [action, []])),

  subscribe(subscriber) {
    validateSubscriber(subscriber);
    for (const action of actions) {
      if (subscriber[action]) {
        this._subscribers[action].push(subscriber[action]);
      }
    }
  },

  async run(action, properties) {
    if (isValidAction(action)) {
      for (const subscriber of this._subscribers[action]) {
        await subscriber(properties);
      }
    }
  },
});

const actions = ['beforeInstall', 'afterInstall', 'beforeUninstall', 'afterUninstall'];

function isValidAction(action) {
  return actions.includes(action);
}

function validateSubscriber(subscriber) {
  Object.keys(subscriber).forEach((key) => {
    if (!actions.includes(key)) {
      throw new Error(`Invalid subscriber: "${key}" should not be defined`);
    }
  });
  actions.forEach((action) => {
    if (subscriber[action] && typeof subscriber[action] !== 'function') {
      throw new Error(`Invalid subscriber: "${action}" is not a function`);
    }
  });
}

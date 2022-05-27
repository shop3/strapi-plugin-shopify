module.exports = {
  "extends": [
    "eslint:recommended",
    "prettier",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:node/recommended"
  ],
  "plugins": ["prettier"],
  "env": {
    "es6": true,
    "node": true,
    "jest": true,
    "browser": false
  },
  "globals": {
    "strapi": false
  },
  "rules": {
    "prettier/prettier": "error",
    "indent": ["error", 2, { "SwitchCase": 1 }],
    "linebreak-style": ["error", "unix"],
    "no-console": "error",
    "quotes": ["error", "single", { "avoidEscape": true }],
    "semi": ["error", "always"],
    "strict": ["error", "global"],
    "no-unused-vars": ["warn", { "ignoreRestSiblings": true }],
    "no-return-await": "error",
    "import/order": "error",
    "import/no-cycle": "error",
    "import/no-useless-path-segments": "error",
    "import/first": "error",
    "import/extensions": ["error", "never"],
    "import/newline-after-import": "error",
    "import/no-extraneous-dependencies": "error",
    "node/exports-style": ["error", "module.exports"],
    "node/no-new-require": "error",
    "node/no-path-concat": "error",
    "node/no-callback-literal": "error",
    "node/handle-callback-err": "error"
  }
}

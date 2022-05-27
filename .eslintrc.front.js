module.exports = {
  "parser": "@babel/eslint-parser",
  "extends": [
    "eslint:recommended",
    "prettier",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:react/recommended"
  ],
  "plugins": ["react", "import", "prettier"],
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true,
    "jest": true
  },
  "parserOptions": {
    "requireConfigFile": false,
    "sourceType": "module",
    "babelOptions": {
      "presets": ["@babel/preset-react"]
    }
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "globals": {
    "process": true
  },
  "rules": {
    "prettier/prettier": "error",
    "indent": ["error", 2, { "SwitchCase": 1 }],
    "linebreak-style": ["error", "unix"],
    "no-console": "error",
    "quotes": ["error", "single", { "avoidEscape": true }],
    "semi": ["error", "always"],
    "no-unused-vars": ["warn", { "ignoreRestSiblings": true }],
    "no-return-await": "error",
    "import/order": "error",
    "import/no-cycle": "error",
    "import/no-useless-path-segments": "error",
    "import/first": "error",
    "import/extensions": ["error", "never", { "json": "always" }],
    "import/newline-after-import": "error",
    "import/no-extraneous-dependencies": "error"
  }
}
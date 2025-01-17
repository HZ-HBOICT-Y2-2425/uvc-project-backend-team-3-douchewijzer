import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node // Add node globals
      },
    },
    rules: {
      "semi": ["error", "always"], // Require semicolons
      "indent": ["error", 2], // Enforce 2-space indentation
      "no-console": "warn", // Warn about console.log statements
      "no-unused-vars": ["warn", {
        "vars": "all",
        "args": "after-used",
        "caughtErrors": "all",
        "ignoreRestSiblings": false,
        "reportUsedIgnorePattern": false}],
      "no-undef": ["warn"] // Disallow the use of undefined variables
    },
  },
  pluginJs.configs.recommended, // Extends the recommended JS rules
];

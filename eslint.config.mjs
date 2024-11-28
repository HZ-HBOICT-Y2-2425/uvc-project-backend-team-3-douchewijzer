import globals from "globals";
import pluginJs from "@eslint/js";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {languageOptions: { globals: globals.browser,
  },
  rules: {
    "semi": ["error", "always"], //Require semicolons
    "indent": ["error", 2], //Enforce 2-space indentation
    "no-console": "warn", // Warn about console.log statements
    "no-unused-vars": "warn", // Warn about unused variables
    "no-undef": ["error"] // Disallow the use of undefined variables
  },
  },
  pluginJs.configs.recommended, // Extends the recommended JS rules
];

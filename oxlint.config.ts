import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";

export default defineConfig({
  extends: [core],
  ignorePatterns: core.ignorePatterns,
  rules: {
    "eslint/no-use-before-define": "off",
    "eslint/func-style": "off",
    "eslint/sort-keys": "off",
    "eslint/require-await": "off",
    "eslint/require-unicode-regexp": "off",
    "unicorn/switch-case-braces": "off",
    "unicorn/catch-error-name": "off",
  },
});

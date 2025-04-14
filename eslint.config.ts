import { defineConfig } from "eslint/config";
import { ConfigWithExtendsArray } from "@eslint/config-helpers";
import js from "@eslint/js";
import globals from "globals";
import { configs } from "typescript-eslint";
import prettierConfig from "eslint-plugin-prettier/recommended";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  configs.recommended as ConfigWithExtendsArray,
  prettierConfig,
]);

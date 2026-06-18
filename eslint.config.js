import js from "@eslint/js";
import globals from "globals";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // TypeScript / JS files
  {
    files: ["**/*.{ts,js,mjs,cjs}"],
    plugins: { js, "@typescript-eslint": tsPlugin },
    extends: [
      "js/recommended",                     // JS recommended rules
      "plugin:@typescript-eslint/recommended", // TS recommended
      "plugin:@angular-eslint/recommended",    // Angular recommended
      "plugin:prettier/recommended"            // Prettier integration
    ]
  },

  // Angular HTML templates
  {
    files: ["**/*.html"],
    extends: ["plugin:@angular-eslint/template/recommended"]
  },

  // Browser globals
  {
    files: ["**/*.{ts,js,mjs,cjs}"],
    languageOptions: { globals: globals.browser }
  }
]);

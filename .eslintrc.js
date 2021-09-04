module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["google", "plugin:prettier/recommended"],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
    "sort-imports": [
      "error",
      { memberSyntaxSortOrder: ["all", "single", "multiple", "none"] },
    ],
  },
};

module.exports = {
  parserOptions: {
    ecmaVersion: 6,
  },
  env: {
    es6: true,
    node: true,
  },
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
  ],
  overrides: [
    {
      files: ["*.js?(x)"],
      extends: ["plugin:prettier/recommended"],
    },
    {
      files: ["*.ts?(x)"],
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
        "prettier/@typescript-eslint",
      ],
      parserOptions: {
        ecmaVersion: 8,
        project: "./tsconfig.json",
      },
      rules: {
        "@typescript-eslint/explicit-function-return-type": [
          "warn",
          {
            allowExpressions: true,
            allowTypedFunctionExpressions: true,
          },
        ],
        "@typescript-eslint/explicit-member-accessibility": [
          "error",
          { accessibility: "no-public" },
        ],
      },
    },
    // override(
    //   ["*.test.{j,t}s?(x)"],
    //   {
    //     ...require("eslint-plugin-jest").configs.recommended,
    //     env: { jest: true },
    //   },
    // ),
  ],
}

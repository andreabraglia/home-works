module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "@soluzioni-futura/eslint-config-soluzioni-futura"
  ],
  settings: {
    react: {
      version: "detect"
    }
  },
  env: {
    es6: true,
    node: true
  },
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 11,
    sourceType: "module",
    project: "./tsconfig.json"
  },
  plugins: [
    "react",
    "react-hooks",
    "@typescript-eslint"
  ],
  rules: {
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/type-annotation-spacing": [
      "error"
    ],
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/ban-types": [
      "error",
      {
        types: {
          any: {},
          unknown: {}
        }
      }
    ],
    "@typescript-eslint/member-delimiter-style": ["error", {
      multiline: {
        delimiter: "none",
        requireLast: false
      },
      singleline: {
        delimiter: "comma",
        requireLast: false
      }
    }],
    "@typescript-eslint/no-empty-function": 0,
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unsafe-return": "error",
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/consistent-type-assertions": "error",
    "@typescript-eslint/class-literal-property-style": "error",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/typedef": "error",
    "prettier/prettier": 0,
    "comma-dangle": [
      "warn",
      "never"
    ],
    "comma-spacing": [
      "error",
      {
        before: false,
        after: true
      }
    ],
    indent: [
      "error",
      2,
      {
        MemberExpression: 1,
        SwitchCase: 1
      }
    ],
    "no-empty": [
      "error",
      {
        allowEmptyCatch: true
      }
    ],
    "no-multiple-empty-lines": [
      "error"
    ],
    "no-new-symbol": "error",
    "no-undef": [
      "error"
    ],
    "no-unused-vars": [
      "warn"
    ],
    "no-console": [
      "warn"
    ],
    "object-curly-spacing": [
      "error",
      "always"
    ],
    "object-shorthand": "error",
    "prefer-const": 2,
    quotes: [
      "error",
      "double"
    ],
    semi: [
      "error",
      "never"
    ],
    "space-in-parens": [
      "error",
      "never"
    ],
    "array-bracket-spacing": [
      "error",
      "never"
    ],
    "space-infix-ops": [
      "error"
    ],
    curly: [
      "error"
    ],
    "brace-style": [
      "error",
      "1tbs",
      {
        allowSingleLine: false
      }
    ],
    "keyword-spacing": [
      "error",
      {
        before: true,
        after: true
      }
    ],
    "quote-props": [
      "error",
      "as-needed"
    ]
  },
  overrides: [
    {
      files: ["src/**/*.js"],
      rules: {
        quotes: [2, "single"]
      }
    }
  ]
}
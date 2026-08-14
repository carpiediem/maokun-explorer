// babel-preset-react-app (pulled in via the "react-app" config, since react-scripts 5) throws
// unless NODE_ENV/BABEL_ENV is set. react-scripts sets it when linting runs through its own CLI,
// but editor integrations (e.g. the VSCode ESLint extension) invoke eslint directly without it.
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
  plugins: ['sonarjs'],
  extends: ['react-app', 'react-app/jest'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'import/no-anonymous-default-export': 'off',
    'jest/no-conditional-expect': 'off',
  },
  overrides: [
    {
      files: ['*.test.js', '*.spec.js'],
      rules: {
        'jest/no-conditional-expect': 'off',
        'sonarjs/no-duplicate-string': 'off',
        'sonarjs/no-identical-functions': 'off',
      },
    },
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
};

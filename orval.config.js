// orval.config.js
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  'metrics-api': {
    input: isDev
      ? 'http://localhost:8080/swagger/doc.json'
      : './backend-contract/docs/swagger.json',
    output: {
      target: './src/api/api.ts',
      schemas: './src/api/models',
      client: 'react-query',
      prettier: true,
    },
  },
};
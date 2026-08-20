module.exports = {
  'metrics-api': {
    input: 'http://localhost:8080/swagger/doc.json',
    output: {
      target: './src/api/api.ts',
      schemas: './src/api/models',
      client: 'react-query',
      prettier: true,
    },
  },
};
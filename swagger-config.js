const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API for ADC',
    version: '1.0.0',
    description:
      'This is a REST API application made with Express. It retrieves data from MongoDB.',
    license: {
      name: 'Licensed Under MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    },
    contact: {
      name: 'Dat Ho',
      url: 'https://github.com/thaidatdh',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
};
const swagger_options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./routes/*.js'],
};
module.exports = {
  swaggerDefinition,
  swagger_options,
}
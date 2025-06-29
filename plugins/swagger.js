'use strict'

import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastifyPlugin from 'fastify-plugin';


// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fastifyPlugin(async function (fastify, opts) {
  await fastify.register(fastifySwagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'O2O Api',
        description: 'Api for o2o(office-to-online)',
        version: '0.1.0'
      },
      servers: [
        {
          url: 'http://localhost:5000',
          description: 'Development server'
        }
      ],
      components: {
        securitySchemes: {
          // Authorization: {
          //   type: 'apiKey',
          //   name: 'Authorization',
          //   in: 'header'
          // }
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      },
      security: [
        {
          bearerAuth: []
        }
      ],
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here'
      }
    }
  })

  await fastify.register(fastifySwaggerUi, {
    routePrefix: '/api_docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    },
    uiHooks: {
      onRequest: function (request, reply, next) { next() },
      preHandler: function (request, reply, next) { next() }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
    transformSpecificationClone: true
  });
})
import fastifySensible from '@fastify/sensible'
import fastifyPlugin from 'fastify-plugin'

// const fp = require('fastify-plugin')

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
export default fastifyPlugin(async function (fastify, opts) {
  fastify.register(fastifySensible, {
    errorHandler: false
  })
})

'use strict'

import fastifyBcrypt from "fastify-bcrypt";
import fastifyPlugin from "fastify-plugin"

export default fastifyPlugin(async function (fastify, opts) {
  await fastify.register(fastifyBcrypt, {
    saltRounds : 12
  });
})
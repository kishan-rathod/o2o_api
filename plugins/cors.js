'use strict'

import fastifyCors from "@fastify/cors"
import fastifyPlugin from "fastify-plugin"

export default fastifyPlugin(async function (fastify, opts) {
  await fastify.register(fastifyCors, {
    credentials: true,
    strictPreflight: false,
    origin: process.env.FRONTEND_URL,
    methods: ['POST', 'PATCH', 'DELETE'],
  });
})
import fastifyPlugin from "fastify-plugin"
import fastifyRedis from "@fastify/redis"
import redisConfig from "../config/redis.js"

export default fastifyPlugin(async function (fastify, opts) {
  fastify.register(fastifyRedis, redisConfig).register(fastifyRedis, {
    namespace: 'companies'
  })
})
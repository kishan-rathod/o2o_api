"use strict";

import fastifyPlugin from "fastify-plugin";
import qs from "qs";

export default fastifyPlugin(async function (fastify, options) {
  fastify.addHook('onRequest', async (request, reply) => {
    if (request.raw.url.includes('?')) {
      const queryString = request.raw.url.split('?')[1];
      const parsedQuery = qs.parse(queryString);
      request.query = parsedQuery;
    }
  });
});

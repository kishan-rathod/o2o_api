"use strict";

import fastifyPlugin from "fastify-plugin";

import db from '../config/db.js'

export default fastifyPlugin(async function(fastify, options) {
  fastify.addHook("onRequest", async (request, reply) => {
    // const company_id = request?.params?.company_id;
    const tokenData = request?.headers?.authorization ? await request.jwtVerify() : {};
    const { company_id = null } = tokenData;

    const { redis } = fastify;

    if(company_id){
      const companies =  await redis.get('companies');
      const company_data = JSON.parse(companies);
      const company = company_data[company_id];
      console.log("company:", company);

      if (!company) {
        return reply.status(404).send({ error: "Tenant not found" });
      }
  
      const companyConfig = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: company['db_name'],
        port: process.env.DB_PORT,
      }
  
      // Create a company-specific connection pool
      const companyPool = db.createPool(companyConfig);
  
      // Attach company pool to request
      request.companyDb = companyPool;
      console.log("COMPANY DB:", company['name']);
      
  
      // Cleanup pool after response
      reply.raw.on("finish", () => {
        companyPool.end(); // Closes all connections
      });
    }
  });
});

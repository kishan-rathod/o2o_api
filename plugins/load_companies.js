"use strict";

import fastifyPlugin from 'fastify-plugin';
import db from '../config/db.js';
// const { rootPool } = require("../config/db");
// import rootPool from '../config/db.js'

export default fastifyPlugin.fastifyPlugin(async function(fastify, options) {
  fastify.addHook('onReady', async function () {
    const companiesQuery = await db.rootPool.query("SELECT * FROM public.companies");
    const companies = companiesQuery.rows

    const { redis } = fastify;

    const companiesData = {};
  
    for (let index = 0; index < companies.length; index++) {      
      const element = companies[index];
      global.companies[element.id] = element;
      companiesData[element.id] = element;

      // redis.set('companies', JSON.stringify(global.companies));
      // redis['companies'].set(element.sub_domain, JSON.stringify(element));
    }
    redis.set('companies', JSON.stringify(companiesData));    
  })
})
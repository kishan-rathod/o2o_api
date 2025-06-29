'use strict'

import fastifyJwt from "@fastify/jwt";
import fastifyPlugin from "fastify-plugin"
import db from "../config/db.js";
import { errorCodes } from "../utils/constant.js";

export default fastifyPlugin(async function (fastify, opts) {
  await fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET,
    sign: {
      expiresIn: '1h'
    }
  });

  fastify.decorate('authenticate', async (request, reply) => {
    try {
      const tokenData = request?.headers?.authorization ? await request.jwtVerify() : null;
      // console.log(tokenData);
      request.tokenData = tokenData; // Store token data in request for further use       
      if(tokenData){
        const query = await db.rootPool.query("SELECT * from users where id = $1", [tokenData.id]);
        const data = query.rows;
        const { password, ...userData } = data[0];
        request.current_user = userData;
        console.log("UD:", userData);
        
      }
    } catch (err) {
      // console.log(err.code);
      if(err.code === errorCodes.jwt_token_expired) {
        reply.status(401).send({ 
          message: 'Your session expired. Please sign in again to continue',
          error_code: err.code
        });
      }
      else if(err.code === errorCodes.jwt_token_invalid) {
        reply.status(401).send({ 
          message: 'Invalid token',
          error_code: err.code
        });
      }
      else if(err.code === errorCodes.jwt_token_missing) {
        reply.status(401).send({ 
          message: 'You need to sign in before continuing',
          error_code: err.code
        });
      }
      else{
        reply.status(401).send({ 
          message: 'Unauthorized',
          error_code: err.code
        });
      }
    }
  });
})
'use strict'

import db from "../../../../config/db.js";

export default async function (fastify, opts) {

  fastify.route({
    method: 'POST',
    url: '/get_user_companies',
    schema: {
      description: 'Get company details for authentication',
      summary: 'authentication',
      tags: ['auth'],
      body: {
        type: 'object',
        properties: {
          data: {
            type: 'object',
            properties: {
              auth: {
                type: 'object',
                properties: {
                  email: {
                    type: 'string',
                    description: 'Enter user email'
                  },
                }
              },
            }
          }
        }
      },      
    },
    handler: async function (request, reply) {
      const email = request?.body?.auth?.email;      
      if(email){
        const companiesQuery = await db.rootPool.query("SELECT c.id, c.name, c.created_at, c.updated_at FROM users u JOIN company_users cu ON u.id = cu.user_id JOIN companies c ON cu.company_id = c.id WHERE u.email = $1",
          [email]);
        const companies = companiesQuery.rows;        
        const { redis } = fastify;
        let data = await redis.companies.get('narola');
        let result = JSON.parse(data);
        return { companies: companies };
      }else{
        return { error: 'Email missing'};
      }
    }
  });

  fastify.route({
    method: 'POST',
    url: '/sign_in',
    schema: {
      description: 'Get company details for authentication',
      summary: 'authentication',
      tags: ['auth'],
      body: {
        type: 'object',
        properties: {
          data: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
                description: 'Enter user email'
              },
              password: {
                type: 'string',
                description: 'Enter user password'
              },
            }
          }
        }
      },      
    },
    handler: async function (request, reply) {
      const email = request?.body?.data?.email;
      const password = request?.body?.data?.password;
      console.log(request?.body);
      
      if(email){
        const query = await db.rootPool.query("SELECT * from users where email = $1", [email]);
        const data = query.rows;
        const encrypteredPassword = await fastify.bcrypt.hash(password);
        console.log(encrypteredPassword);
        

        if(data.length > 0){
          const passwordMatch = await fastify.bcrypt.compare(password, data[0].password);
          if(passwordMatch){
            const { password, ...userData } = data[0];            
            const token = fastify.jwt.sign({
              id: userData.id,
              company_id: userData.default_company_id
            });
            reply.code(200).send({
              data: { 
                token,
                current_user: {
                  ...userData,
                  full_name: `${userData.first_name} ${userData.last_name}`,
                }
              },
              message: `Welcome, ${userData?.first_name} ${userData?.last_name}`,
            });
          }else{
            reply.code(400).send({ error: 'Please enter valid email and password' });
          }
        }
      }else{
        reply.code(400).send({ error: 'Please enter email and password'})
      }
    }
  })

  fastify.route({
    method: 'POST',
    url: '/get_current_user',
    schema: {
      description: 'Get current user details',
      summary: 'authentication',
      tags: ['auth'],
    },
    onRequest: fastify.authenticate,
    handler: async function (request, reply) {
      console.log(request?.headers?.authorization);
      
      const current_user = request?.current_user
      reply.code(200).send({
        data: {
          ...current_user,
          full_name: `${current_user.first_name} ${current_user.last_name}`,
        }
      });
    }
  })

}

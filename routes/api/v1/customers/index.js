'use strict'

export default async function (fastify, opts) {

  // fastify.get('/listing', async function (request, reply) {
    // const company_db = request?.companyDb;
    // // console.log(request);
    // console.log(request?.body?.auth);
    
    // if(company_db){
    //   const {email, password} = request?.body?.auth;
    //   const encrypteredPassword = await fastify.bcrypt.hash(password);
    //   console.log(encrypteredPassword);
      
    //   const result  = await company_db.query(`Insert into users values(NULL, '${email}', '${encrypteredPassword}')`);
    //   console.log(result);

    //   console.log(await fastify.bcrypt.hash(password));
      
    //   console.log("with company db");
    //   return { data: result }
    // }else{
    //   return { error: 'Company missing'};
    // }
  // });

  fastify.route({
    method: 'GET',
    url: '/listing',
    schema: {
      description: 'Get customers of company',
      summary: 'customers',
    },
    onRequest: fastify.authenticate,
    handler: async function (request, reply) {
      const company_db = request?.companyDb;
      if (company_db) {
        console.log("QUERY:", request?.query);
        const pagination = request?.query?.pagination || {};
        const { page = 1, pageSize = 10 } = pagination;        
        const offset = (page - 1) * pageSize;
        const countResult = await company_db.query(`SELECT COUNT(*) FROM users WHERE role = 'customer'`);
        const totalCount = countResult.rows[0]?.count || 0;
        const result = await company_db.query(`SELECT * FROM users where role = 'customer' LIMIT ${pageSize} OFFSET ${offset}`);
        reply.code(200).send({
          data: {
            list: result.rows,
            total: totalCount,
          }
        });
      } else {
        return { error: 'Company missing' };
      }
    }
  })

}

const serverless = require('serverless-http');
const app = require('./app');

const handler = serverless(app);

const startServer = async () => {
    app.listen(3000, () => {
      console.log("listening on port 3000!");
    });
}

startServer();

module.exports.handler = (event, context, callback) => {
    const response = handler(event, context, callback);
    return response;
};

// const serverlessExpress = require('@vendia/serverless-express')
// const app = require('./app');

// /**
//  * @type {import('http').Server}
//  */
// const server = serververlessExpress.createServer(app);

// /**
//  * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
//  */
// exports.handler = async (event, context) => {
//   console.log(`EVENT: ${JSON.stringify(event)}`);
//   context.callbackWaitsForEmptyEventLoop = false;
//   return serververlessExpress( server ,event, context);
// };

// let serverlessExpressInstance

// function asyncTask () {
//   return new Promise((resolve) => {
//     setTimeout(() => resolve('connected to database'), 1000)
//   })
// }

// async function setup (event, context) {
//   const asyncValue = await asyncTask()
//   console.log(asyncValue)
//   serverlessExpressInstance = serverlessExpress({ app })
//   return serverlessExpressInstance(event, context)
// }

// exports.handler = (event, context) =>{
//   if (serverlessExpressInstance) return serverlessExpressInstance(event, context)

//   return setup(event, context)
// }
const serververlessExpress = require('@vendia/serverless-express')
const app = require('./app');

/**
 * @type {import('http').Server}
 */
const server = serververlessExpress.createServer(app);

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event, context) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  context.callbackWaitsForEmptyEventLoop = false;
  return serververlessExpress({ app })(event, context);
};

export const MOCK_APIGATEWAY_REST_EVENT: AWSLambda.APIGatewayEvent = {
  resource: '/api/{proxy+}',
  path: '/api/test',
  httpMethod: 'GET',
  headers: {
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,zh-TW;q=0.6',
    'cache-control': 'no-cache',
    'Host': 'mockapi.execute-api.us-east-1.amazonaws.com',
    'sec-ch-ua': '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'none',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
    'X-Amzn-Trace-Id': 'Root=1-mock-traceid',
    'X-Forwarded-For': '127.0.0.1',
    'X-Forwarded-Port': '443',
    'X-Forwarded-Proto': 'https'
  },
  multiValueHeaders: {
    'accept': [
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
    ],
    'accept-encoding': [ 'gzip, deflate, br' ],
    'accept-language': [ 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,zh-TW;q=0.6' ],
    'cache-control': [ 'no-cache' ],
    'Host': [ 'mockapi.execute-api.us-east-1.amazonaws.com' ],
    'sec-ch-ua': [
      '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"'
    ],
    'sec-ch-ua-mobile': [ '?0' ],
    'sec-ch-ua-platform': [ '"Windows"' ],
    'sec-fetch-dest': [ 'document' ],
    'sec-fetch-mode': [ 'navigate' ],
    'sec-fetch-site': [ 'none' ],
    'sec-fetch-user': [ '?1' ],
    'upgrade-insecure-requests': [ '1' ],
    'User-Agent': [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36'
    ],
    'X-Amzn-Trace-Id': [ 'Root=1-mock-traceid' ],
    'X-Forwarded-For': [ '127.0.0.1' ],
    'X-Forwarded-Port': [ '443' ],
    'X-Forwarded-Proto': [ 'https' ]
  },
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  stageVariables: null,
  requestContext: {
    accountId: 'mockaccountid',
    apiId: 'mockapi',
    domainName: 'mockapi.execute-api.us-east-1.amazonaws.com',
    resourceId: 'mockresourceid',
    resourcePath: '/api/{proxy+}',
    httpMethod: 'GET',
    extendedRequestId: 'mockrequestid',
    requestTime: '07/Feb/2023:09:17:37 +0000',
    path: '/test/api/test',
    protocol: 'HTTP/1.1',
    stage: 'test',
    domainPrefix: 'mockapi',
    requestTimeEpoch: 1675761457119,
    requestId: 'mock-request-uuid',
    identity: {
      cognitoIdentityPoolId: null,
      accountId: null,
      cognitoIdentityId: null,
      caller: null,
      sourceIp: '127.0.0.1',
      principalOrgId: null,
      accessKey: null,
      cognitoAuthenticationType: null,
      cognitoAuthenticationProvider: null,
      userArn: null,
      user: null,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36'
    } as AWSLambda.APIGatewayEventIdentity
  } as AWSLambda.APIGatewayEventRequestContextWithAuthorizer<AWSLambda.APIGatewayEventDefaultAuthorizerContext>,
  pathParameters: { proxy: 'test' },
  body: null,
  isBase64Encoded: false
}

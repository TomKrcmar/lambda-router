export const MOCK_APIGATEWAYV2_EVENT: AWSLambda.APIGatewayProxyEventV2 = {
  version: '2.0',
  routeKey: 'ANY /api/{proxy+}',
  rawPath: '/api/test',
  rawQueryString: '',
  headers: {
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,zh-TW;q=0.6',
    'cache-control': 'max-age=0',
    'content-length': '0',
    'host': 'mockapi.execute-api.us-east-1.amazonaws.com',
    'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="109", "Google Chrome";v="109"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'none',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
    'x-amzn-trace-id': 'Root=1-mock-traceid',
    'x-forwarded-for': '127.0.0.1',
    'x-forwarded-port': '443',
    'x-forwarded-proto': 'https'
  },
  requestContext: {
    accountId: 'mockaccountid',
    apiId: 'mockapi',
    domainName: 'mockapi.execute-api.us-east-1.amazonaws.com',
    routeKey: 'ANY /api/{proxy+}',
    stage: '$default',
    domainPrefix: 'mockapi',
    time: '19/Jan/2023:21:55:50 +0000',
    timeEpoch: 1674165350088,
    requestId: 'mockrequestid',
    http: {
      method: 'GET',
      path: '/api/test',
      protocol: 'HTTP/1.1',
      sourceIp: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36'
    }
  },
  pathParameters: { proxy: 'test' },
  isBase64Encoded: false
}

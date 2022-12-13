import AWSLambda from 'aws-lambda';
import { Method } from './Http';
import { Request } from './Request';
import { Router } from './Router';

type HandlerResult = AWSLambda.APIGatewayProxyStructuredResultV2;

export class LambdaRouter extends Router {

	async dispatchLambda(event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context): Promise<HandlerResult> {
		const request = new Request();
		request.data.aws = {
			lambda: {
				event,
				context,
			}
		};

		request.path = event.path;
		request.method = event.httpMethod.toLowerCase() as Method;
		
		Object.keys(event.headers).forEach(k => request.headers[k.toLowerCase()] = event.headers[k] || '');

		const query = event.queryStringParameters || {};
		Object.keys(query).forEach(k => {
			const v = query[k];
			if (v !== undefined) request.query[k] = v;
		});

		const params = event.pathParameters || {};
		Object.keys(params).forEach(k => {
			const v = params[k];
			if (v !== undefined) request.params[k] = v;
		});

		request.body = event.body || '';

		const response = await this.dispatch(request);
		
		return {
			statusCode: response.statusCode,
			headers: response.headers,
			body: response.body,
		};
	}

}
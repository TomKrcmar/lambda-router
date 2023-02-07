import AWSLambda from 'aws-lambda';
import { Method } from '../Http';
import { Request } from '../Request';
import { Response } from '../Response';
import { Router, RouterConfig } from '../Router';

type HandlerResult = AWSLambda.APIGatewayProxyResult | AWSLambda.APIGatewayProxyStructuredResultV2;
type EventType = AWSLambda.APIGatewayProxyEvent | AWSLambda.APIGatewayProxyEventV2;

export function parseEventCommon(event: EventType, context: AWSLambda.Context): Request {
	const request = new Request();
	request.data.aws = {
		lambda: {
			event,
			context,
		}
	};
	
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

	const bodyRaw = event.body || '';
	request.body = event.isBase64Encoded ? atob(bodyRaw) : bodyRaw;

	return request;
}

export function parseEventV1(event: AWSLambda.APIGatewayProxyEvent, context: AWSLambda.Context): Request {
	const request = parseEventCommon(event, context);
	request.path = event.path;
	request.method = event.httpMethod.toLowerCase() as Method;
	return request;
}

export function parseEventV2(event: AWSLambda.APIGatewayProxyEventV2, context: AWSLambda.Context): Request {
	const request = parseEventCommon(event, context);
	request.path = event.requestContext.http.path;
	request.method = event.requestContext.http.method.toLowerCase() as Method;
	return request;
}

export function parseEvent(event: EventType, context: AWSLambda.Context): Request {
	if ((event as AWSLambda.APIGatewayProxyEventV2).version === '2.0') {
		return parseEventV2(event as AWSLambda.APIGatewayProxyEventV2, context);
	}
	else {
		return parseEventV1(event as AWSLambda.APIGatewayProxyEvent, context);
	}
}

export function serializeResponse(response: Response) {
	return {
		statusCode: response.statusCode,
		headers: response.headers,
		body: response.body,
	};
}
export const serializeResponseV1 = serializeResponse;
export const serializeResponseV2 = serializeResponse;

export class LambdaRouter extends Router {

	constructor(config?: RouterConfig) {
		super(config);
	}

	async dispatchLambda(event: EventType, context: AWSLambda.Context): Promise<HandlerResult> {
		try {
			const request = parseEvent(event, context);
			const response = await this.dispatch(request);
			return serializeResponse(response);
		}
		catch(e) {
			this.logError('Unhandled exception interpreting Lambda event: ', e);
			return {
				statusCode: 500,
				body: '',
			};
		}
	}

}
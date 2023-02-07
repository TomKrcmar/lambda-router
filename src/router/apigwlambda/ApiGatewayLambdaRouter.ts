import AWSLambda from 'aws-lambda';
import { Router, RouterConfig } from '../Router';
import { parseEventV1, serializeResponseV1 } from './LambdaRouter';

type HandlerResult = AWSLambda.APIGatewayProxyResult;

export class ApiGatewayLambdaRouter extends Router {

	constructor(config?: RouterConfig) {
		super(config);
	}

	async dispatchLambda(event: AWSLambda.APIGatewayProxyEvent, context: AWSLambda.Context): Promise<HandlerResult> {
		try {
			const request = parseEventV1(event, context);
			const response = await this.dispatch(request);
			return serializeResponseV1(response);
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
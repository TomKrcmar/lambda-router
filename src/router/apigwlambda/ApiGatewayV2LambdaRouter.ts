import AWSLambda from 'aws-lambda';
import { Router, RouterConfig } from '../Router';
import { parseEventV2, serializeResponseV2 } from './LambdaRouter';

type HandlerResult = AWSLambda.APIGatewayProxyStructuredResultV2;

export class ApiGatewayV2LambdaRouter extends Router {

	constructor(config?: RouterConfig) {
		super(config);
	}

	async dispatchLambda(event: AWSLambda.APIGatewayProxyEventV2, context: AWSLambda.Context): Promise<HandlerResult> {
		try {
			const request = parseEventV2(event, context);
			const response = await this.dispatch(request);
			return serializeResponseV2(response);
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
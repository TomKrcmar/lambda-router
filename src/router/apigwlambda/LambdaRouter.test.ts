import { MOCK_APIGATEWAY_REST_EVENT } from '../../mock/apigwrestevent';
import { MOCK_APIGATEWAYV2_EVENT } from '../../mock/apigwv2event';
import { parseEvent } from './LambdaRouter';

describe('LambdaRouter', () => {
	it('parses v1 events', () => {
		const req = parseEvent(MOCK_APIGATEWAY_REST_EVENT, {} as any);
		expect(req.path).toBe('/api/test');
		expect(req.method).toBe('get');
		expect(req.body).toBe('');
		expect(req.data).toMatchObject({
			aws: { lambda: { event: {
				resource: '/api/{proxy+}',
			}}}
		});
	})

	it('parses v2 events', () => {
		const req = parseEvent(MOCK_APIGATEWAYV2_EVENT, {} as any);
		expect(req.path).toBe('/api/test');
		expect(req.method).toBe('get');
		expect(req.body).toBe('');
		expect(req.data).toMatchObject({
			aws: { lambda: { event: {
				version: '2.0',
				routeKey: 'ANY /api/{proxy+}',
			}}}
		});
	})
})
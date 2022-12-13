import { Request } from './Request';

describe('Request', () => {
	it('returns headers in a case-insensitive way', async () => {
		const req = new Request();
		req.headers['content-type'] = 'application/json';

		expect(req.header('Content-Type')).toBe('application/json');
	})
})
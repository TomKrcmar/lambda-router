import { Response } from './Response';

describe('Response', () => {
	it('sets the status code', async () => {
		const res = new Response();
		expect(res.status(200).statusCode).toBe(200);
		expect(res.status(404).statusCode).toBe(404);
	})

	it('sets the sent flag', async () => {
		const res = new Response();
		expect(res.sent).toBe(false);
		expect(res.status(200).send('OK').sent).toBe(true);
	})

	it('sets headers in a case-insensitive way', async () => {
		const res = new Response();
		res.header('Content-Type', 'application/json');
		res.setHeaders(
			{
				'A': '1',
				'B': '2',
			}, {
				'C': '3',
			}
		);
		
		expect(res.headers['content-type']).toBe('application/json');
		expect(res.headers['a']).toBe('1');
		expect(res.headers['b']).toBe('2');
		expect(res.headers['c']).toBe('3');
	})

	it('unsets headers', async () => {
		const res = new Response();
		res.header('A', '1');
		expect(res.headers).toHaveProperty('a');
		res.header('A', undefined);
		expect(res.headers).not.toHaveProperty('a');
	})

	it('performs redirects', async () => {
		const res = new Response();
		res.redirect('test');
		expect(res.sent).toBe(true);
		expect(res.statusCode).toBe(301);
		expect(res.headers['location']).toBe('test');
	})
})
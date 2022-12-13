import { HttpError } from './Http';

describe('HttpError', () => {
	it('implements Error', async () => {
		const error = new HttpError(200, 'Anything');
		expect(error.code).toBe(200);
		expect(error.message).toBe('Anything');
	})

	it('generates messages when omitted', async () => {
		expect(new HttpError(200).message).toBe('OK');
		expect(new HttpError(418).message).toBe('I\'m a Teapot');
	})

	it('generates messages when error code is unknown', async () => {
		expect(new HttpError(487).message).toBe('Client Error');
		expect(new HttpError(572).message).toBe('Server Error');
	})
})
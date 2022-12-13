import { Method, HeaderKey } from './Http';

export class Request {
	path: string = '/';
	method: Method = 'get';
	headers: Record<HeaderKey, string> = {};
	query: Record<string, string> = {};
	params: Record<string, string> = {};
	body: string = '';
	
	data: Record<string, any> = {};

	constructor() {}

	header(key: HeaderKey) {
		return this.headers[key.toLowerCase()];
	}
}

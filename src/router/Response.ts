import { HeaderKey } from './Http';

export class Response {
	sent: boolean = false;
	
	statusCode: number = 0;
	headers: Record<HeaderKey, string> = {};
	body: string = '';
	
	data: Record<string, any> = {};

	constructor() {}

	status(status: number) {
		this.statusCode = status;
		return this;
	}

	header(key: HeaderKey, value: string | undefined) {
		key = key.toLowerCase();
		if (value === undefined)
			delete this.headers[key];
		else
			this.headers[key] = value;
		return this;
	}

	setHeaders(...args: Record<string, string>[]) {
		for (let i=0; i<args.length; i++) {
			const arg = args[i];
			for (let key in arg)
				this.header(key, arg[key]);
		}
	}

	redirect(url: string) {
		return this.status(301).header('Location', url).send();
	}

	send(body?: string | undefined) {
		this.body = body || '';
		this.sent = true;
		return this;
	}
}
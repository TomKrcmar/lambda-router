import { Request } from './Request';
import { Response } from './Response';
import { RouteDecl } from './RouteDecl';

export class Context {
	request: Request;
	response: Response;

	useNext: boolean = false;
	routeStack: RouteDecl[] = [];
	data: Record<string, any> = {};
	
	constructor(request: Request, response: Response) {
		this.request = request;
		this.response = response;
	}

	next() {
		this.useNext = true;
	}
}

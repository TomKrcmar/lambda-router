import { RoutePart, parseRoute, parsePath, matchParsed } from '../route-match';
import { Method } from './Http';
import { Request } from './Request';
import { Response } from './Response';
import { Context } from './Context';
import { Router } from './Router';

export type MwResultSync = Response | object | string | undefined;
export type MwResult = Promise<MwResultSync> | MwResultSync;
export type MwFunction = (req: Request, res: Response, ctx: Context) => MwResult | void;
export type Middleware = Router | MwFunction;

export type Route = string;

export type RouteFilter = {
	route?: Route;
	method?: Method;
};

export class RouteDecl {
	routeParts: RoutePart[];
	filter: RouteFilter;
	mw: Middleware;

	constructor(filter: RouteFilter, mw: Middleware) {
		this.filter = filter;
		this.mw = mw;

		this.routeParts = parseRoute(this.filter.route || '');
	}

	match(ctx: Context) {
		const { route, method } = this.filter;
		const { request: req, routeStack } = ctx;

		if (route) {
			const pathParts = parsePath(req.path);
			const finalStack = routeStack.concat([this]);
			let routeParts: RoutePart[] = [];

			for (let i=0; i<finalStack.length; i++)
				routeParts = routeParts.concat(finalStack[i].routeParts);

			const match = matchParsed(routeParts, pathParts);

			if (match)
				Object.assign(req.params, match.params);
			else
				return false;
		}

		if (method && req.method !== method)
			return false;

		return true;
	}
}
import { HttpError, Method } from './Http';
import { RouteDecl, Route, Middleware, RouteFilter, MwResultSync } from './RouteDecl';
import { Request } from './Request';
import { Response } from './Response';
import { Context } from './Context';

export type LogLevel = 'info' | 'warn' | 'error';

export type RouterConfig = {
	name?: string;
	silent?: boolean;
	verbose?: boolean;
};

export class Router {
	config: RouterConfig = {};
	routes: RouteDecl[] = [];

	constructor(config?: RouterConfig) {
		this.config = config || {};
	}

	log(level: LogLevel, ...args: any[]) {
		const { silent = false, verbose = false, name } = this.config;
		if (silent) return;

		const type = this.constructor.name || 'Router';
		const instance = name ? `:${name}` : '';
		const prefix = `[${type}${instance}] ${level.toUpperCase()}: `;
		args.unshift(prefix);

		switch (level) {
			case 'info': if (verbose) console.info(...args); break;
			case 'warn': if (verbose) console.warn(...args); break;
			case 'error': console.error(...args); break;
			default: break;
		}
	}
	logInfo(...args: any[]) { return this.log('info', ...args); }
	logWarn(...args: any[]) { return this.log('warn', ...args); }
	logError(...args: any[]) { return this.log('error', ...args); }

	use(routeOrMw: Route | Middleware, middleware?: Middleware): Router {
		const hasRoute = typeof routeOrMw === 'string';
		let route = hasRoute ? routeOrMw : undefined;
		let mw = hasRoute ? middleware : routeOrMw;
		if (mw) this._use({ route }, mw);
		return this;
	}

	useEx(route: Route | undefined, method: Method | undefined, mw: Middleware) {
		return this._use({ route, method }, mw);
	}

	private _use(filter: RouteFilter, mw: Middleware) {
		this.routes.push(new RouteDecl(filter, mw));
		return this;
	}

	get(route: Route, mw: Middleware) { return this.useEx(route, 'get', mw) }
	post(route: Route, mw: Middleware) { return this.useEx(route, 'post', mw) }
	put(route: Route, mw: Middleware) { return this.useEx(route, 'put', mw) }
	patch(route: Route, mw: Middleware) { return this.useEx(route, 'patch', mw) }
	delete(route: Route, mw: Middleware) { return this.useEx(route, 'delete', mw) }

	private async _dispatch(ctx: Context): Promise<MwResultSync> {
		const { routes } = this;
		let lastResult: MwResultSync = undefined;

		for (let i=0; i<routes.length; i++) {
			const route = routes[i];

			if (route.match(ctx)) {
				const { mw } = route;
				
				ctx.routeStack.push(route);

				try {
					if (mw instanceof Router) {
						ctx.useNext = true;
						const originalParams = Object.assign({}, ctx.request.params);
						lastResult = await mw._dispatch(ctx);
						ctx.request.params = originalParams;
					}
					else {
						ctx.useNext = false;
						lastResult = await mw(ctx.request, ctx.response, ctx) || undefined;
					}
					ctx.routeStack.pop();
				}
				catch(e) {
					ctx.routeStack.pop();
					throw e;
				}

				if (!ctx.useNext || ctx.response.sent)
					break;
			}
		}

		return lastResult;
	}

	async dispatch(request: Request): Promise<Response> {
		const response = new Response();
		const ctx = new Context(request, response);

		try {
			const result = await this._dispatch(ctx);

			if (response.sent) {
				return response;
			}
			/*else {
				let body = '';
				if (!result) body = '';
				else if (typeof result === 'number') body = `${result}`;
				else if (typeof result === 'string') body = result;
				else if (result instanceof Response) body = response.body;
				else if (typeof result === 'object') body = JSON.stringify(result);
				
				if (response.statusCode === 0)
					response.status(200);
				
				return response.send(body);
			}*/

			const method = request.method;
			const path = request.path;
			throw new HttpError(404, `Cannot ${method.toUpperCase()} ${path}`);
		}
		catch(e: any) {
			if (e instanceof HttpError) {
				this.logInfo(`${request.method} ${request.path} => HTTP ${e.code}: ${e.message}`);
				return response.status(e.code).send(`[HTTP ${e.code}] ${e.message}`);
			}
			
			this.logError('Unhandled non-HTTP error in middleware: ', e.stack);
			return response.status(500).send('Internal server error');
		}
	}
}


export type RoutePart = {
	name: string;
	isParameter: boolean;
	isRequired: boolean;
};

export type MatchOptions = {
	exact?: boolean;
};

export type MatchResult = undefined | {
	params: Record<string, string>;
	trailingParts: string[];
	trailingPath: string;
};

const DEFAULT_OPTIONS: MatchOptions = {
	exact: false,
};

export function parsePath(path: string): string[] {
	return path.split('/').filter(x => x.length > 0);
}

export function parseRoute(route: string): RoutePart[] {
	const parts = route.split('/').filter(x => x.length > 0).map(x => {
		let name = x;
		const isParameter = name[0] === ':';
		const isRequired = name[name.length-1] !== '?';
		if (isParameter) name = name.substring(1);
		if (!isRequired) name = name.substring(0, name.length-1);
		return { name, isParameter, isRequired };
	});
	validateRouteParts(parts, route);
	return parts;
}

export function validateRouteParts(parts: RoutePart[], originalRoute: string) {
	let foundOptional = false;
	for (let i=0; i<parts.length; i++) {
		const part = parts[i];
		if (!foundOptional && !part.isRequired)
			foundOptional = true;
		else if (foundOptional && part.isRequired)
			throw new Error(`Required part '${part.name}' cannot follow an optional part in route '${originalRoute}'`);
	}
	return true;
}

export function matchParsed(routeParts: RoutePart[], pathParts: string[], options?: MatchOptions): MatchResult {
	const {
		exact = false
	} = options || {};

	routeParts = routeParts.slice();
	pathParts = pathParts.slice();

	const params: Record<string, string> = {};

	while (routeParts.length > 0) {
		const { name, isParameter, isRequired } = routeParts.shift() as RoutePart;
		const next = pathParts.shift();

		if (isRequired) {
			if (isParameter) {
				if (next === undefined)
					return undefined;
				else
					params[name] = next;
			}
			else {
				if (next !== name)
					return undefined;
			}
		}
		else {
			if (isParameter) {
				if (next === undefined)
					break;
				else
					params[name] = next;
			}
			else {
				if (next === undefined)
					break;
				else if (next !== name)
					return undefined;
			}
		}
	}

	if (exact && pathParts.length > 0)
		return undefined;
	
	const trailingParts = pathParts;
	const trailingPath = pathParts.join('/');

	return { params, trailingParts, trailingPath };
}

export function match(route: string, path: string, options?: MatchOptions): MatchResult {
	return matchParsed(parseRoute(route), parsePath(path), options);
}
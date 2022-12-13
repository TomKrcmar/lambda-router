# lambda-router

A general purpose middleware, route modeling, and route matching framework.

## Features:
- Familiar, express-like interface
- Nested routers and relative route matching
- Exact or inexact route matching
- Route parameter matching
- Optional routes or route params
- Extendable, integrate with any server framework like Lambda, express, etc.
- Comes with an implementation for routing in Lambda functions

## Usage:

There is no official documentation, but a good way to see example usage is the unit tests.

Instantiate a Router
```ts
import { Router } from 'lambda-router';
const router = new Router();
```

Simple HTTP request
```ts
// "get" can also be post, put, patch, delete
router.get('/hello', (req, res) => {
	res.send('Hello, World!');
})
```

Simple Middleware
```ts
router.use((req, res, ctx) => {
	// All 3 arguments have their own `data` property for custom props passed down to subsequent middleware
	req.data.myCustomValueA = 5;
	res.data.myCustomValueB = 6;
	ctx.data.myCustomValueC = 7;

	// Allow subsequent middleware and route matching to continue
	ctx.next();

	// Note: ctx also contains other misc. information about the current router stack and dispatching state.
})
```

Nested Routers example
```ts
const thingRouter = new Router();
thingRouter.get('thing', (req, res) => {
	res.send('Thing data');
})

router.use('/path/to/the', thingRouter);

// At this point, GET /path/to/the/thing will match the handler
```

Method chaining (set status code, set one header, set multiple headers, send with body)
```ts
router.get('/hello', (req, res) => {
	res.status(200)
		.header('Content-type', 'text/plain')
		.setHeaders({
			'X-Header-One': 'ABC',
			'X-Header-Two': '123',
		})
		.send('Hello, World!');
})
```

CORS middlware example
```ts
import { Router } from 'lambda-router';

const router = new Router();
export default router;

router.use((req, res, ctx) => {
	res.setHeaders({
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE',
		'Access-Control-Allow-Credentials': 'true',
		'Access-Control-Allow-Headers': 'Content-Type,Authorization',
	});
	
	if (req.method === 'options')
		res.status(200).send();
	else
		ctx.next();
})
```

### **Lambda Handler**:

Simply add your routes on a `LambdaRouter` at the top level and supply it to your `handler` export in lambda. The rest of your app can be built with `Router`s and are completely portable, only the top-level router needs to be a `LambdaRouter`.

Minimal example
```ts
import { LambdaRouter } from 'lambda-router';
import myAppRouter from './my-app';

export function handler(event, context) {
	return new LambdaRouter().use(myAppRouter).dispatchLambda(event, context);
}
```

Example of adding our CORS middleware above, and a hello world endpoint directly onto the top-level router:

```ts
import { LambdaRouter } from 'lambda-router';
import cors from './my-middleware/cors';

const router = new LambdaRouter();

router.use(cors);

router.get('/hello', (req, res) => {
	res.send('Hello, World!');
})

export function handler(event, context) {
	return router.dispatchLambda(event, context);
}
```

### **Custom Integration**:
In order to integrate your route model into a server framework, there are two steps:
- Construct a `Request`
- Call `Router.dispatch(request)`
- Handle the `Response`

The `LambdaRouter` above performs all of these steps for you, constructing a `Request` from your lambda event and context, and converting the `Response` to the lambda handler response structure that lambda expects.

Minimal example of manually doing this with no conversion:
```ts
import { Request, Router } from 'lambda-router';

const router = new Router();
router.use('/hello', (req, res) => res.send('Hello, World!'))

const req = new Request();
req.path = '/hello';

const res = await router.dispatch(req);
// res.body should now be populated with 'Hello, World!' with status code 200 and other misc. fields present
```

## Installation

```sh
# Install as a runtime dependency
npm install --save lambda-router

# Install as a development dependency if you have your own build or bundling process
npm install --save-dev lambda-router
```

## Building and Testing

Build the module yourself:
```sh
npm run build

# Build in watch mode:
npm run build:w
```

Run unit tests and coverage:
```sh
npm run test

# Test in watch mode:
npm run test:w
```

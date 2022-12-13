import { Request } from './Request';
import { MwFunction } from './RouteDecl';
import { Router } from './Router';

function next() {
	return ((req, res, ctx) => ctx.next()) as MwFunction;
}
function send() {
	return ((req, res, ctx) => res.send()) as MwFunction;
}

describe('Router', () => {
	it('filters by route', async () => {
		const router = new Router();

		const req = new Request();
		req.path = '/a/b';

		const fn0 = jest.fn(next());
		const fn1 = jest.fn();
		const fn2 = jest.fn();

		router.use(fn0);
		router.use('/a', fn1);
		router.use('/a/b', fn2);

		await router.dispatch(req);

		expect(fn0).toHaveBeenCalledTimes(1);
		expect(fn1).toHaveBeenCalledTimes(1);
		expect(fn2).toHaveBeenCalledTimes(0);
	})

	it('filters by route with nested routers', async () => {
		const router = new Router();
		const r0 = new Router();
		const r1 = new Router();

		const fn0 = jest.fn(next());
		const fn1 = jest.fn(next());
		const fn2 = jest.fn();
		const fn3 = jest.fn();
		const fn4 = jest.fn(send());
		const fn5 = jest.fn();

		router.use(fn0);

		r0.use(fn1);
		r0.use('/r0/a', fn2);

		r1.use('/r1/a', fn3);

		router.use(r0);
		router.use(r1);
		router.use('/a/b', fn4);
		router.use('/a/b', fn5);

		const req = new Request();
		req.path = '/a/b';

		await router.dispatch(req);

		expect(fn0).toHaveBeenCalledTimes(1);
		expect(fn1).toHaveBeenCalledTimes(1);
		expect(fn2).toHaveBeenCalledTimes(0);
		expect(fn3).toHaveBeenCalledTimes(0);
		expect(fn4).toHaveBeenCalledTimes(1);
		expect(fn5).toHaveBeenCalledTimes(0);
	})

	it('filters by request method', async () => {
		const router = new Router();
		const fn0 = jest.fn(send());
		const fn1 = jest.fn(send());

		router.post('/a/b', fn0);
		router.put('/a/b', fn0);
		router.patch('/a/b', fn0);
		router.delete('/a/b', fn0);
		router.get('/a/b', fn1);

		const req = new Request();
		req.method = 'get';
		req.path = '/a/b';

		await router.dispatch(req);

		expect(fn0).toHaveBeenCalledTimes(0);
		expect(fn1).toHaveBeenCalledTimes(1);
	})

	it('handles 404 fallthrough', async () => {
		const router = new Router();
		const fn0 = jest.fn(send());
		const fn1 = jest.fn(send());

		router.get('/a/b', fn0);
		router.get('/a/b', fn1);

		const req = new Request();
		req.method = 'get';
		req.path = '/a/c';

		const res = await router.dispatch(req);

		expect(fn0).toHaveBeenCalledTimes(0);
		expect(fn1).toHaveBeenCalledTimes(0);
		expect(res.sent).toBe(true);
		expect(res.statusCode).toBe(404);
	})

	it('handles errors without throwing', async () => {
		const router = new Router();
		const fn0 = jest.fn(() => {
			throw new Error('Unhandled error within middleware');
		});
		const fn1 = jest.fn(send());

		router.use(fn0);
		router.use(fn1);

		const req = new Request();
		const res = await router.dispatch(req);

		expect(fn0).toHaveBeenCalledTimes(1);
		expect(fn1).toHaveBeenCalledTimes(0);
		expect(res.sent).toBe(true);
		expect(res.statusCode).toBe(500);
	})
})
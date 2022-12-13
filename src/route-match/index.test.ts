import { match, MatchResult } from '.';

function expectDefined(value: MatchResult) {
	expect(value).toBeDefined();
	return expect(value);
}

describe('route-match', () => {
	it('matches simple routes', () => {
		expectDefined(match('', ''             )).toMatchObject({ trailingPath: '', params: {} });
		expectDefined(match('test', 'test'     )).toMatchObject({ trailingPath: '', params: {} });
		expectDefined(match('test', 'test/path')).toMatchObject({ trailingPath: 'path', params: {} });
	})
	it('matches route parameters', () => {
		expectDefined(match('test/:param', 'test/123')).toMatchObject({ trailingPath: '', params: { param: '123' } });
	})
	it('matches optional parts', () => {
		expectDefined(match('test/path?/:param?', 'test'              )).toMatchObject({ trailingPath: '',     params: {} });
		expectDefined(match('test/path?/:param?', 'test/path'         )).toMatchObject({ trailingPath: '',     params: {} });
		expectDefined(match('test/path?/:param?', 'test/path/123'     )).toMatchObject({ trailingPath: '',     params: { param: '123' } });
		expectDefined(match('test/path?/:param?', 'test/path/123/more')).toMatchObject({ trailingPath: 'more', params: { param: '123' } });
		
		expectDefined(match('test/:a?/:b?', 'test'    )).toMatchObject({ trailingPath: '', params: {} });
		expectDefined(match('test/:a?/:b?', 'test/1'  )).toMatchObject({ trailingPath: '', params: { a: '1' } });
		expectDefined(match('test/:a?/:b?', 'test/1/2')).toMatchObject({ trailingPath: '', params: { a: '1', b: '2' } });
		expectDefined(match('test/:a/:b?',  'test/1/2')).toMatchObject({ trailingPath: '', params: { a: '1', b: '2' } });
		expectDefined(match('test/:a/:b',   'test/1/2')).toMatchObject({ trailingPath: '', params: { a: '1', b: '2' } });
	})
	it('fails paths that do not match', () => {
		expect(match('a/b/:c', 'a/b')).toBeUndefined();
		expect(match('a/b/c', 'a/b/d')).toBeUndefined();
		expect(match('a', '')).toBeUndefined();
		expect(match('a/b', 'b/a')).toBeUndefined();
		expect(match('a/b?/:c?', 'a/c')).toBeUndefined();
	})
	it('respects exact match option', () => {
		const opt = { exact: true };
		expectDefined(match('a/b',   'a/b', opt)).toMatchObject({ trailingPath: '', params: {} });
		expectDefined(match('a/:b',  'a/1', opt)).toMatchObject({ trailingPath: '', params: { b: '1' } });
		expectDefined(match('a/:b?', 'a/1', opt)).toMatchObject({ trailingPath: '', params: { b: '1' } });
		expectDefined(match('a/:b?', 'a',   opt)).toMatchObject({ trailingPath: '', params: {} });

		expect(       match('a/b',   'a/b/c', opt)).toBeUndefined();
		expect(       match('a/:b',  'a/1/2', opt)).toBeUndefined();
		expect(       match('a/:b?', 'a/1/2', opt)).toBeUndefined();
	})
	it('keeps optional parts at the end', () => {
		expect(() => match('test/path?/:param', 'test/path2')).toThrow();
	})
})

import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
	input: 'src/index.ts',
	output: {
		dir: 'build',
		format: 'es',
	},
	plugins: [
		typescript(),
		nodeResolve({ preferBuiltins: true }),
		commonjs(),
	],
};
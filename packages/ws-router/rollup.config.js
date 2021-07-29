import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import babel from '@rollup/plugin-babel';

import linaria from '@linaria/rollup';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

// eslint-disable-next-line import/no-anonymous-default-export
export default [
	{
		input: './src/index.ts',
		output: [
			{
				name: 'ui',
				dir: 'umd',
				format: 'umd',
				sourcemap: true,
			},
		],
		plugins: [
			resolve({ extensions }),

			commonjs(),

			babel({
				extensions,
				babelHelpers: 'runtime',
				include: ['src/**/*', 'src/*'],
			}),

			peerDepsExternal(),
		],
	},
	{
		input: './src/index.ts',
		output: [
			{
				dir: 'es',
				format: 'esm',
				sourcemap: true,
			},
			{
				dir: 'lib',
				format: 'cjs',
				sourcemap: true,
			},
		],
		plugins: [
			resolve({ extensions }),

			commonjs(),

			babel({
				extensions,
				babelHelpers: 'runtime',
				include: ['src/**/*', 'src/*'],
			}),

			peerDepsExternal(),
		],
		external(id) {
			return id.indexOf('node_modules') >= 0;
		},
	},
];

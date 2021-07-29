import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import babel from '@rollup/plugin-babel';

import linaria from '@linaria/rollup';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

// eslint-disable-next-line import/no-anonymous-default-export
export default [
	{
		input: './components/index.ts',
		output: [
			{
				name: 'ui',
				dir: 'umd',
				format: 'umd',
				sourcemap: true,
			},
		],
		plugins: [
			linaria({
				sourceMap: process.env.NODE_ENV !== 'production',
			}),
			resolve({ extensions }),

			// Allow bundling cjs modules. Rollup doesn't understand cjs
			commonjs(),

			// Compile TypeScript/JavaScript files

			babel({
				extensions,
				babelHelpers: 'runtime',
				include: ['components/**/*', 'components/*'],
			}),

			peerDepsExternal(),
			postcss({
				extract: true,
			}),
		],
	},
	{
		input: './components/index.ts',
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
			linaria({
				sourceMap: process.env.NODE_ENV !== 'production',
			}),
			resolve({ extensions }),

			// Allow bundling cjs modules. Rollup doesn't understand cjs
			commonjs(),

			// Compile TypeScript/JavaScript files

			babel({
				extensions,
				babelHelpers: 'runtime',
				include: ['components/**/*', 'components/*'],
			}),

			peerDepsExternal(),
			postcss({
				extract: true,
			}),
		],
		external(id) {
			return id.indexOf('node_modules') >= 0;
		},
	},
	{
		input: './example/index.tsx',
		output: [
			{
				// file: 'index.js',
				dir: 'example/build',
				format: 'esm',
				name: 'cool',
				sourcemap: true,
			},
		],
		plugins: [
			linaria({
				sourceMap: process.env.NODE_ENV !== 'production',
			}),
			resolve({ extensions }),
			// Allow bundling cjs modules. Rollup doesn't understand cjs
			commonjs(),

			// Compile TypeScript/JavaScript files

			babel({
				extensions,
				babelHelpers: 'runtime',
				include: ['example/*'],
			}),

			peerDepsExternal(),
			postcss({
				extract: true,
			}),
		],
		external(id) {
			return id.indexOf('node_modules') >= 0;
		},
	},
];

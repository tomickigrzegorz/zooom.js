import copy from 'rollup-plugin-copy';
import babel from '@rollup/plugin-babel';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import pkg from "./package.json";

const { PRODUCTION } = process.env;
const extensions = ['.ts'];

const banner = `/*!\n* Zooom.js - the easiest way to enlarge a photo\n* @version v${pkg.version}\n* @link ${pkg.homepage}\n* @license ${pkg.license}\n*/`;

const plugins = () => {
  return [
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
      presets: ['@babel/preset-env'],
      plugins: ['@babel/proposal-class-properties'],
      extensions
    }),
    PRODUCTION && terser(),
    typescript({
      noEmitOnError: false
    }),
    copy({
      targets: [
        { src: './images/**/*', dest: 'docs/images' }
      ]
    }),
    !PRODUCTION && serve({ open: true, contentBase: 'docs' }),
    !PRODUCTION && livereload(),
  ]
}

export default [
  {
    input: 'sources/js/index.ts',
    output: {
      file: pkg.main,
      format: 'iife',
      name: 'Zooom',
      banner,
      sourcemap: !PRODUCTION
    },
    plugins: plugins()
  },
  {
    input: 'sources/js/index.ts',
    output: {
      file: pkg.browser,
      format: 'umd',
      name: 'Zooom',
      banner,
    },
    plugins: plugins()
  },
];
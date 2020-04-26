import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';
import commonjs from '@rollup/plugin-commonjs';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import { uglify } from 'rollup-plugin-uglify';

const { PRODUCTION } = process.env;

export default {
  input: 'sources/script.js',
  output: {
    file: 'docs/zooom.min.js',
    format: 'iife',
    name: 'Zooom'
  },
  plugins: [
    commonjs(),
    resolve(),
    babel({ exclude: 'node_modules/**' }),
    (PRODUCTION && uglify()),
    copy({
      targets: [
        { src: 'sources/index.html', dest: 'docs/' },
        { src: './images/**/*', dest: 'docs/images' }
      ]
    }),
    (!PRODUCTION && serve({ open: true, contentBase: 'docs' })),
    (!PRODUCTION && livereload())
  ]
};
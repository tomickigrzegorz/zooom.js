import copy from 'rollup-plugin-copy';
import banner from 'rollup-plugin-banner';
import babel from '@rollup/plugin-babel';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import pkg from "./package.json";

const { PRODUCTION } = process.env;

export default {
  input: 'sources/script.js',
  output: {
    file: pkg.main,
    format: 'iife',
    name: 'Zooom',
    sourcemap: !PRODUCTION
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled'
    }),
    terser(),
    (PRODUCTION && banner('Zooom.js - the easiest way to enlarge a photo\n@version v<%= pkg.version %>\n@link <%= pkg.homepage %>\n@license <%= pkg.license %>')),
    copy({
      targets: [
        { src: './images/**/*', dest: 'docs/images' }
      ]
    }),
    !PRODUCTION && serve({ open: true, contentBase: 'docs' }),
    !PRODUCTION && livereload(),
  ]
};
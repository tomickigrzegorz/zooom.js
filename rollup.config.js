import copy from 'rollup-plugin-copy';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import banner from 'rollup-plugin-banner';
import compiler from '@ampproject/rollup-plugin-closure-compiler';

const { PRODUCTION } = process.env;

export default {
  input: 'sources/script.js',
  output: {
    file: 'docs/zooom.min.js',
    format: 'iife',
    name: 'Zooom'
  },
  plugins: [
    compiler({
      languageIn: 'ECMASCRIPT6',
      language_out: 'ECMASCRIPT5',
      compilation_level: 'ADVANCED',
      externs: './sources/externs/externs.js'
    }),
    banner('Zooom.js - the easiest way to enlarge a photo\n@version v<%= pkg.version %>\n@link <%= pkg.homepage %>\n@license <%= pkg.license %>'),
    copy({
      targets: [
        { src: './images/**/*', dest: 'docs/images' }
      ]
    }),
    (!PRODUCTION && serve({ open: true, contentBase: ['./docs', './sources'] })),
    (!PRODUCTION && livereload())
  ]
};
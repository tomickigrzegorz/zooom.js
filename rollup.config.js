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
    name: 'Zooom',
    sourcemap: PRODUCTION ? false : true
  },
  plugins: [
    compiler({
      language_in: 'ECMASCRIPT6',
      language_out: 'ECMASCRIPT5',
      externs: './sources/externs/externs.js',
      compilation_level: 'ADVANCED',
      // compilation_level: 'WHITESPACE_ONLY',
      // compilation_level: 'SIMPLE',
      // debug: true,
      // source_map_format: 'V3'
    }),
    (PRODUCTION && banner('Zooom.js - the easiest way to enlarge a photo\n@version v<%= pkg.version %>\n@link <%= pkg.homepage %>\n@license <%= pkg.license %>')),
    copy({
      targets: [
        { src: './images/**/*', dest: 'docs/images' }
      ]
    }),
    (!PRODUCTION && serve({ open: true, contentBase: ['./docs', './sources'] })),
    (!PRODUCTION && livereload())
  ]
};
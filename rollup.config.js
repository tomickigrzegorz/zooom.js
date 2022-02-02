import copy from "rollup-plugin-copy";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import typescript from "@rollup/plugin-typescript";
import cleanup from "rollup-plugin-cleanup";
import { babel } from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

const { PRODUCTION } = process.env;

const input = "sources/js/index.ts";

const banner = `/*!\n* Zooom.js - the easiest way to enlarge a photo\n* @version v${pkg.version}\n* @link ${pkg.homepage}\n* @license ${pkg.license}\n*/`;

const sharedPlugins = (target) => {
  return [
    babel({ babelHelpers: "bundled" }),
    cleanup(),
    typescript({ noEmitOnError: false, target }),
  ];
};

const terserConfig = {
  mangle: {
    // properties: true,
    properties: {
      regex: /^_/,
    },
  },
};

export default [
  // --------------------------------------------------
  // iife
  {
    input,
    watch: false,
    plugins: [...sharedPlugins("es6")],
    output: {
      banner,
      file: "dist/zooom.js",
      format: "iife",
      name: "Zooom",
      sourcemap: true,
    },
  },
  {
    input,
    watch: false,
    plugins: [...sharedPlugins("es6")],
    output: {
      banner,
      file: "dist/zooom.min.js",
      format: "iife",
      name: "Zooom",
      sourcemap: false,
      plugins: [terser({ ...terserConfig })],
    },
  },
  {
    input,
    plugins: [
      ...sharedPlugins("es6"),
      copy({
        targets: [{ src: "./images/**/*", dest: "docs/images" }],
      }),
      !PRODUCTION && serve({ open: true, contentBase: ["docs", "images"] }),
      !PRODUCTION && livereload(),
    ],
    output: {
      banner,
      file: "docs/zooom.min.js",
      format: "iife",
      name: "Zooom",
      sourcemap: true,
      plugins: [terser({ ...terserConfig })],
    },
  },
  // --------------------------------------------------
  // umd
  {
    input,
    watch: false,
    plugins: [...sharedPlugins("es6")],
    output: {
      banner,
      file: "dist/zooom.umd.js",
      format: "umd",
      name: "Zooom",
      sourcemap: true,
    },
  },
  {
    input,
    watch: false,
    plugins: [...sharedPlugins("es6")],
    output: {
      banner,
      file: "dist/zooom.umd.min.js",
      format: "umd",
      name: "Zooom",
      sourcemap: false,
      plugins: [terser({ ...terserConfig })],
    },
  },
  // --------------------------------------------------
  // esm
  {
    input,
    watch: false,
    plugins: [...sharedPlugins("es6")],
    output: {
      banner,
      file: "dist/zooom.es.js",
      format: "es",
      name: "Zooom",
      sourcemap: true,
    },
  },
  {
    input,
    watch: false,
    plugins: [...sharedPlugins("es6")],
    output: {
      banner,
      file: "dist/zooom.es.min.js",
      format: "es",
      name: "Zooom",
      sourcemap: false,
      plugins: [terser({ ...terserConfig })],
    },
  },
  // --------------------------------------------------
  // ie
  {
    input,
    watch: false,
    plugins: [...sharedPlugins("es5")],
    output: {
      banner,
      file: "dist/zooom.ie.min.js",
      format: "iife",
      name: "Zooom",
      sourcemap: false,
      plugins: [terser({ ...terserConfig })],
    },
  },
];

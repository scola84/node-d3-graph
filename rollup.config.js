import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default {
  dest: './dist/d3-graph.js',
  entry: 'index.js',
  format: 'umd',
  moduleName: 'd3',
  plugins: [
    resolve({
      jsnext: true
    }),
    commonjs(),
    buble()
  ]
};

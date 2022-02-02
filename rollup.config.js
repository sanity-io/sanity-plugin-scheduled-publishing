import {babel} from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'

export default {
  // supress warnings with sanity parts + config
  external: (id) => !!(id.startsWith('config:') || id.startsWith('part:')),
  input: [
    'src/documentActions.ts', //
    'src/documentBadges.ts',
    'src/tool.ts',
  ],
  output: [
    {
      dir: 'lib',
      exports: 'auto',
      format: 'cjs',
    },
  ],
  plugins: [
    peerDepsExternal(),
    nodeResolve({resolveOnly: ['@vvo/tzdb']}),
    json(), // needed by @vvo/tzdb
    babel({
      babelHelpers: 'bundled',
      include: ['node_modules/@vvo/tzdb/**'],
      presets: ['@babel/env'],
    }),
    typescript(),
  ],
}

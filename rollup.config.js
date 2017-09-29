// @flow

import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import analyze from 'rollup-analyzer-plugin'

export default {
  input: 'src/index.js',
  output: {
    file: 'module/bundle.js',
    format: 'es'
  },
  plugins: [
    analyze(),
    nodeResolve(),
    commonjs({
      namedExports: {
        '@vx/axis': ['Axis', 'AxisLeft', 'AxisRight', 'AxisTop', 'AxisBottom', 'Orientation'],
        '@vx/curve': ['curveBasis', 'curveBasisClosed', 'curveBasisOpen', 'curveStep', 'curveStepAfter', 'curveStepBefore', 'curveBundle', 'curveLinear', 'curveLinearClosed', 'curveCardinal', 'curveCardinalClosed', 'curveCardinalOpen', 'curveCatmullRom', 'curveCatmullRomClosed', 'curveCatmullRomOpen', 'curveMonotoneX', 'curveMonotoneY', 'curveNatural'],
        '@vx/event': ['localPoint'],
        '@vx/grid': ['GridRows', 'GridColumns', 'Grid'],
        '@vx/group': ['Group'],
        '@vx/responsive': ['ScaleSVG', 'withParentSize', 'withScreenSize'],
        '@vx/scale': ['scaleBand', 'scalePoint', 'scaleLinear', 'scaleTime', 'scaleUtc', 'scaleLog', 'scalePower', 'scaleOrdinal', 'scaleQuantize', 'scaleQuantile', 'scaleThreshold', 'schemeCategory10', 'schemeCategory20', 'schemeCategory20b', 'schemeCategory20c', 'updateScale'],
        '@vx/shape': ['Arc', 'Line', 'LinePath', 'LineRadial', 'LinkHorizontal', 'LinkVertical', 'LinkRadial', 'AreaClosed', 'AreaStack', 'Bar', 'BarGroup', 'BarStack', 'callOrValue'],
      }
    }),
    babel({
      exclude: 'node_modules/**'
    })
  ],
  external: ['react', 'react-dom']
}

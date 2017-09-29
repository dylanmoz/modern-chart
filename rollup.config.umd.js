// @flow

import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'

const files = [
  { name: 'mc', path: 'src/index.js' },
  { name: 'LineChart', path: 'src/charts/LineChart.js' },
]

export default files.map(file => ({
  input: file.path,
  output: {
    file: `dist/${file.name}.min.js`,
    format: 'umd',
    name: file.name,
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM'
    }
  },
  plugins: [
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
    }),
    // uglify()
  ],
  external: ['react', 'react-dom']
}))

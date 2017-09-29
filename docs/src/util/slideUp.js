// @flow

import React from 'react'
import { Motion, spring } from 'react-motion'

import Delay from './Delay'

export default (Component: any) => ({ style, ...others }: any) => (
  <Delay initial={1} value={0} period={300}>
    {delayed => (
      <Motion
        defaultStyle={{ top: 50, opacity: 0 }}
        style={{
          top: spring(delayed * 50, { stiffness: 80, damping: 17 }),
          opacity: spring(delayed === 1 ? 0 : 1)
        }}
      >
        {intStyle => (
          <Component
            style={{
              top: intStyle.top,
              opacity: intStyle.opacity,
              ...style
            }}
            {...others}
          />
        )}
      </Motion>
    )}
  </Delay>
)

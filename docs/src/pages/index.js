// @flow

import React from 'react'
import Link from 'gatsby-link'
import glamorous from 'glamorous'
import { Motion, spring } from 'react-motion'
import { Container, Row, Col } from 'glamorous-grid'
import 'prismjs'
import 'prismjs/components/prism-jsx'
import { PrismCode } from 'react-prism'

import Delay from 'util/Delay'

const Card = glamorous.div({
  position: 'relative',
  padding: 24,
  backgroundColor: 'white',
  width: '100%',
  height: '100%',
  border: '1px solid #eee',
  borderRadius: 3,
  boxShadow: '0 2px 4px 0 rgba(25, 29, 34, 0.1)'
})

const Code = props => <PrismCode component="pre" className="language-jsx" {...props} />

const CardAnimation = ({ children }: any) => (
  <Delay initial={1} value={0} period={300}>
    {delayed => (
      <Motion
        defaultStyle={{ top: 50, opacity: 0 }}
        style={{
          top: spring(delayed * 50, { stiffness: 80, damping: 17 }),
          opacity: spring(delayed === 1 ? 0 : 1)
        }}
      >
        {style => (
          <Card
            style={{
              top: style.top,
              opacity: style.opacity
            }}
          >
            {children}
          </Card>
        )}
      </Motion>
    )}
  </Delay>
)

const IndexPage = () => (
  <Container pt={24}>
    <Row>
      <Col span={{ xs: 1, lg: 10/12, xl: 8/12 }} offset={{ xs: 0, lg: 1/12, xl: 2/12 }}>
        <Row>
          <Col span={1} mb={24}>
            <CardAnimation>
              <h2>Modern Chart</h2>
              <p>
                Much like modern art, this library doesn't make much sense. For now, it is just
                a collection of charts made with vx and react-motion.
              </p>
              <h4>Usage</h4>
              <pre>
                <code>
                  yarn add modern-chart
                </code>
              </pre>
              <pre>
                <code>
                  {'import { LineChart } from \'modern-chart\''}
                </code>
              </pre>
              <p>
                If you are not using javascript modules yet, you can import IIFE versions
                of the code.
              </p>
              <PrismCode component="pre" className="language-bash">
                  {`// The whole library. All components will be under window.mc
node_modules/modern-chart/dist/bundle.min.js

// Individual components, will be on the window as their given name, i.e. window.LineChart
node_modules/modern-chart/dist/linechart.min.js
`}
              </PrismCode>
            </CardAnimation>
          </Col>
        </Row>
      </Col>
    </Row>
  </Container>
)

export default IndexPage

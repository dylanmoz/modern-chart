// @flow

import React from 'react'
import Link from 'gatsby-link'
import glamorous from 'glamorous'
import { Motion, spring } from 'react-motion'
import { Container, Row, Col } from 'glamorous-grid'
import { PrismCode } from 'react-prism'

import Delay from 'util/Delay'
import Card from 'util/Card'
import slideUp from '../util/slideUp'

const Code = props => <PrismCode component="pre" className="language-jsx" {...props} />

const CardAnimation = slideUp(Card)

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
              <p>
                Note: This website is currently just a placeholder: modern-chart does not yet
                expose any charts.
              </p>
              <ul>
                <li><Link to="/line">Line Chart</Link></li>
              </ul>
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

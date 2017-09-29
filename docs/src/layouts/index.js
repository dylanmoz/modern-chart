// @flow

import '../babel-helpers'

import React from 'react'
import GitHubButton from 'react-github-button'
import Helmet from 'react-helmet'
import { Container, Row, Col } from 'glamorous-grid'

import 'prismjs'
import 'prismjs/components/prism-jsx'

const Header = () => (
  <nav className="navbar">
    <Container style={{ height: '100%' }}>
      <Row alignItems="center" style={{ height: '100%' }}>
        <Col span={{ xs: 1, lg: 10/12, xl: 8/12 }} offset={{ xs: 0, lg: 1/12, xl: 2/12 }}>
          <Row>
            <Col>
              <code style={{ textTransform: 'lowercase' }}>modern-chart</code>
            </Col>
            <Col style={{ height: 20 }}>
              <GitHubButton
                style={{ float: 'right' }}
                type="stargazers"
                namespace="dylanmoz"
                repo="modern-chart"
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  </nav>
)

const TemplateWrapper = ({ children }: any) => (
  <div>
    <Helmet
      title="modern-chart"
      meta={[
        { name: 'description', content: 'React chart components built with vx and react-motion' },
        { name: 'keywords', content: 'react, chart, graph, visualization, vx, react-motion' },
      ]}
    />

    <Header />

    <div style={{ marginTop: '6.5rem', width: '100%', display: 'flex', position: 'relative' }}>
      {children()}
    </div>
  </div>
)

export default TemplateWrapper

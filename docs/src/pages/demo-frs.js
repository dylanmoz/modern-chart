// @flow

import React from 'react'
import Link from 'gatsby-link'
import glamorous from 'glamorous'
import { Motion, spring } from 'react-motion'
import { Container, Row, Col } from 'glamorous-grid'
import { PrismCode } from 'react-prism'

import Card from '../util/Card'
import slideUp from '../util/slideUp'

import { LineChart } from '../../../src'

const CardAnimated = slideUp(Card)

const now = new Date().getTime()
let sum = 0
const series1 = [{
  color: 'rgb(107, 157, 255)',
  data: Array(30).fill(1).map((_, i) => {
    const random = Math.random() * 250
    sum += random

    return {
      date: new Date(now - (i * 1000 * 60 * 60)),
      value: sum
    }
  }).reverse()
}]

const series2 = [{
  color: 'rgb(252, 137, 159)',
  data: [
    { date: new Date(2017, 3, 1), value: 4 },
    { date: new Date(2017, 4, 1), value: 4 },
    { date: new Date(2017, 5, 1), value: 0 },
    { date: new Date(2017, 6, 1), value: 1.5 },
    { date: new Date(2017, 7, 1), value: 2 },
    { date: new Date(2017, 8, 1), value: 1 },
  ]
}]

const series3 = [{
  color: '#ff9900',
  data: [
    { date: new Date(2017, 6, 1), value: 0 },
    { date: new Date(2017, 7, 1), value: 0 },
    { date: new Date(2017, 8, 1), value: 0 },
    { date: new Date(2017, 9, 1), value: 4 },
    { date: new Date(2017, 10, 1), value: 5 },
    { date: new Date(2017, 11, 1), value: 9 },
  ]
}]

const options = [
  { series: series1, title: 'Raised' },
  { series: series2, title: 'Fundraisers' },
  { series: series3, title: 'Donors' }
]

class LineDemo extends React.Component<any> {
  constructor(props) {
    super(props)

    this.state = {
      option: options[0]
    }
  }

  render() {
    return (
      <Container fluid pt={24}>
        <Row justifyContent="center">
          <Col span={{ sm: 1, xl: 3/4 }}>
            <CardAnimated>
              <Row justifyContent="center">
                {options.map((option, i) => (
                  <Col key={i} auto textAlign="center">
                    <button
                      key={option.title}
                      onClick={() => this.setState({ option: options[i] })}
                    >
                      {option.title}
                    </button>
                  </Col>
                ))}
              </Row>

              <Row justifyContent="center">
                <Col span={1}>
                  <LineChart
                    series={this.state.option.series}
                  />
                </Col>
              </Row>
            </CardAnimated>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default LineDemo
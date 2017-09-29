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

const series1 = [{
  color: 'rgb(107, 157, 255)',
  data: [
    { date: new Date(2017, 3, 1), value: 1 },
    { date: new Date(2017, 4, 1), value: 2 },
    { date: new Date(2017, 5, 1), value: 6 },
    { date: new Date(2017, 6, 1), value: 3 },
    { date: new Date(2017, 7, 1), value: 1 },
    { date: new Date(2017, 8, 1), value: 5 }
  ]
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
    { date: new Date(2017, 3, 1), value: 0 },
    { date: new Date(2017, 4, 1), value: 2 },
    { date: new Date(2017, 5, 1), value: 2 },
    { date: new Date(2017, 6, 1), value: 4 },
    { date: new Date(2017, 7, 1), value: 5 },
    { date: new Date(2017, 8, 1), value: 9 },
  ]
}]

const options = [
  { series: series1, title: 'Option 1' },
  { series: series2, title: 'Option 2' },
  { series: series3, title: 'Option 3' }
]
let i = 0
class LineDemo extends React.Component<any> {
  constructor(props) {
    super(props)

    this.state = {
      option: options[i]
    }
  }

  change = () => {
    i += 1
    this.setState({ option: options[i % options.length] })
  }

  render() {
    return (
      <Container pt={24}>
        <Row justifyContent="center">
          <Col span={6/8}>
            <CardAnimated>
              <Row justifyContent="center">
                {options.map((option, i) => (
                  <Col auto textAlign="center">
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

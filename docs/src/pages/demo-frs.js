// @flow

import React from 'react'
import Link from 'gatsby-link'
import glamorous from 'glamorous'
import { Motion, spring } from 'react-motion'
import { Container, Row, Col } from 'glamorous-grid'
import { PrismCode } from 'react-prism'
import { appleStock } from '@vx/mock-data'
import bitcoinPrice from '@vx/mock-data/build/mocks/bitcoinPrice'

import Card from '../util/Card'
import slideUp from '../util/slideUp'

import { LineChart } from '../../../src'

const shark = 'rgb(25, 29, 34)'
const alabaster = 'rgb(248, 248, 248)'
const white = 'rgb(255, 255, 255)'
const primary = 'rgba(25, 29, 34, 0.87)'
const secondary = 'rgba(25, 29, 34, 0.54)'
const tertiary = 'rgba(25, 29, 34, 0.38)'
const primary_reverse = 'rgb(255, 255, 255)'
const secondary_reverse = 'rgba(255, 255, 255, 0.7)'
const tertiary_reverse = 'rgba(255, 255, 255, 0.5)'
const divider = 'rgba(25, 29, 34, 0.12)'
const divider_reverse = 'rgba(255, 255, 255, 0.12)'
const link_bg = 'rgba(25, 29, 34, 0.06)'
const downy = 'rgb(96, 211, 194)'
const picton_blue = 'rgb(66, 194, 246)'
const carnation = 'rgb(247, 116, 98)'
const guardsmen_red = 'rgb(186, 0, 13)'
const sun = 'rgb(243, 156, 38)'

const CardAnimated = slideUp(Card)
const Button = glamorous.button(props => props.selected && {
  borderColor: downy,
  '&:focus': { borderColor: downy },
  '&:active': { borderColor: downy }
})

const apple = appleStock.map(stock => ({ date: new Date(stock.date), value: stock.close }))
const bitcoin = bitcoinPrice.prices.map(
  stock => ({ date: new Date(stock.time), value: +stock.price })
).reverse()

const ranges = [
  { label: '1H', count: 5 },
  { label: '1D', count: 25 },
  { label: '1W', count: 100 },
  { label: '1M', count: 200 },
  { label: '1Y', count: 300 },
  { label: 'ALL', count: 360 }
]

const options = [
  { title: 'Raised', color: sun, data: apple },
  { title: 'Fundraisers', color: downy, data: bitcoin },
  { title: 'Donors', color: picton_blue, data: apple }
].map(option => ({
  ...option,
  data: ranges.reduce(
    (acc, range) => ({
      ...acc,
      [range.label]: [{ color: option.color, data: option.data.slice(0, range.count) }]
    }),
    {}
  )
}))

class LineDemo extends React.Component<any, any> {
  constructor(props) {
    super(props)

    this.state = {
      option: options[0],
      range: ranges[3]
    }
  }

  render() {
    const { option, range } = this.state

    return (
      <Container fluid pt={24}>
        <Row justifyContent="center">
          <Col span={{ sm: 1, xl: 3/4 }}>
            <CardAnimated>
              <Row justifyContent="center">
                {options.map((opt, i) => (
                  <Col key={opt.title} auto textAlign="center">
                    <Button
                      selected={opt === option}
                      onClick={() => this.setState({ option: options[i] })}
                    >
                      {opt.title}
                    </Button>
                  </Col>
                ))}
              </Row>

              <Row justifyContent="center">
                <Col span={1}>
                  <LineChart
                    series={option.data[range.label]}
                  />
                </Col>
              </Row>

              <Row justifyContent="center" pt={24}>
                <Col auto textAlign="center">
                  {ranges.map((rg, i) => (
                    <Button
                      key={rg.label}
                      selected={rg === range}
                      onClick={() => this.setState({ range: ranges[i] })}
                      style={{ marginRight: 12 }}
                    >
                      {rg.label}
                    </Button>
                  ))}
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

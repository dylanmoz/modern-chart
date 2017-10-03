// @flow

import React from 'react'
import glamorous from 'glamorous'
import moize from 'moize'
import { LinearGradient } from '@vx/gradient'
import { AreaClosed, Line, LinePath, Bar } from '@vx/shape'
import { Group } from '@vx/group'
import { curveBasis, curveMonotoneX } from '@vx/curve'
import { withParentSize } from '@vx/responsive'
import { AxisBottom, AxisLeft, AxisRight } from '@vx/axis'
import { GridRows } from '@vx/grid'
import { scaleTime, scaleLinear } from '@vx/scale'
import { localPoint } from '@vx/event'
import touchPoint from '@vx/event/build/touchPoint'
import { Motion, spring, presets } from 'react-motion'
import { extent, bisector, max, min } from 'd3-array'
import { line, area } from 'd3-shape'
import { interpolate, interpolateString, interpolateArray } from 'd3-interpolate'
import shallowEqual from 'fbjs/lib/shallowEqual'
import { interpolatePath } from 'd3-interpolate-path'

import Delay from '../utils/Delay'
import findPathYatX from '../utils/findPathYAtX'


const curveFunc = curveMonotoneX

// memoizing components improves performance from 30fps to 50+fps on 5x throttled cpu
const GridRowsMem = moize.reactSimple(GridRows)
const GroupMem = moize.reactSimple(Group)
const LinePathMem = moize.reactSimple(LinePath)
const AxisLeftMem = moize.reactSimple(AxisLeft)
const AxisRightMem = moize.reactSimple(AxisRight)
const AxisBottomMem = moize.reactSimple(AxisBottom)

const bisectDate = bisector(d => new Date(d.date)).left

const Container = glamorous('div', { shouldClassNameUpdate: () => false })({
  backgroundColor: 'white'
})

const Tooltip = glamorous('div', { shouldClassNameUpdate: () => false })({
  position: 'absolute',
  backgroundColor: 'white',
  color: 'rgba(25, 29, 34, 0.54)',
  padding: 12,
  fontSize: 14,
  boxShadow: '0 4px 8px 0 rgba(25, 29, 34, 0.1)',
  pointerEvents: 'none',
  borderRadius: 3,
  border: '1px solid rgba(25, 29, 34, 0.12)'
})

const aspectRatio = 0.55
const margin = { top: 10, left: 35, bottom: 30, right: 35 }
const padding = { top: 0, left: 60, bottom: 0, right: 60 }

type DataSeries = {
  data: { date: Date, value: number }[],
  label: string,
  color: string
}

type Props = {
  parentWidth: number,
  series: DataSeries[]
}

class TrelloGraph extends React.Component<Props, any> {
  tooltipWidth: number
  pathRefs: Object
  xMax: number
  yMax: number
  xScale: Function
  yScale: Function
  yScaleFormat: Function
  allData: { date: Date, value: number }[]
  svg: ?HTMLBaseElement
  tooltip: ?HTMLDivElement
  interpolateCount: number
  pathInterpolator: Function
  areaInterpolator: Function
  colorInterpolator: Function
  dataInterpolator: Function

  constructor(props: Props) {
    super(props)

    this.tooltipWidth = 0
    this.pathRefs = {}
    this.interpolateCount = 0

    this.state = {
      tooltipOpen: false,
      tooltipLeft: 0,
      tooltipTop: 0,
      tooltipData: null,
      vertLineLeft: 0
    }
  }

  componentWillMount() {
    const series = this.props.series[0]

    this.update()

    const pathFn = line()
      .x(d => this.xScale(this.x(d)))
      .y(d => this.yScale(this.y(d)))
      .defined(() => true)
      .curve(curveFunc)
    const areaPathFn = area()
      .x(d => this.xScale(this.x(d)))
      .y0(this.yScale.range()[0] + 50)
      .y1(d => this.yScale(this.y(d)))
      .curve(curveFunc)

    this.pathInterpolator = interpolatePath(pathFn(series.data), pathFn(series.data))
    this.areaInterpolator = interpolatePath(
      areaPathFn(series.data),
      areaPathFn(series.data),
      (start, end) => start.x === end.x && start.x === this.xMax
    )
    this.colorInterpolator = interpolate(series.color, series.color)
    this.dataInterpolator = interpolateArray(series.data, series.data)
  }

  componentWillReceiveProps(nextProps) {
    if (!shallowEqual(this.props, nextProps)) {
      this.update(nextProps)
    }
  }

  update(props = this.props) {
    const currentXScale = this.xScale
    const currentYScale = this.yScale

    this.xMax = this.getXMax(props)
    this.yMax = this.getYMax(props)
    this.allData = props.series.reduce((acc, { data }) => acc.concat(data), [])

    this.xScale = this.getXScale(this.allData, this.x, this.xMax)
    this.yScale = this.getYScale(this.allData, this.y, this.yMax)

    this.yScaleFormat = this.yScale.tickFormat(3, '0.10')

    const series = this.props.series
    const nextSeries = props.series
    if (series !== nextSeries && series.length === 1 && nextSeries.length === 1) {
      this.interpolateCount += 1

      const path1 = line()
        .x(d => currentXScale(this.x(d)))
        .y(d => currentYScale(this.y(d)))
        .defined(() => true)
        .curve(curveFunc)
      const path2 = line()
        .x(d => this.xScale(this.x(d)))
        .y(d => this.yScale(this.y(d)))
        .defined(() => true)
        .curve(curveFunc)

      const area1 = area()
        .x(d => currentXScale(this.x(d)))
        .y0(currentYScale.range()[0] + 50)
        .y1(d => currentYScale(this.y(d)))
        .curve(curveFunc)
      const area2 = area()
        .x(d => this.xScale(this.x(d)))
        .y0(this.yScale.range()[0] + 50)
        .y1(d => this.yScale(this.y(d)))
        .curve(curveFunc)

      this.pathInterpolator = interpolatePath(path1(series[0].data), path2(nextSeries[0].data))
      this.areaInterpolator = interpolatePath(
        area1(series[0].data),
        area2(nextSeries[0].data),
        (start, end) => start.x === end.x && start.x === this.xMax
      )
      this.colorInterpolator = interpolate(series[0].color, nextSeries[0].color)
    }
  }

  x = d => d.date
  y = d => d.value

  setSvgRef = (ref) => {
    this.svg = ref
  }

  setTooltipRef = (ref) => {
    this.tooltip = ref

    if (this.tooltip) {
      this.tooltipWidth = ref.getBoundingClientRect().width
    }
  }

  setPathRef = (ref) => {
    if (!ref) {
      this.pathRefs = {}
      return
    }

    this.pathRefs[ref.getAttribute('data-index')] = ref
  }

  mouseLeave = (event) => {
    this.closeTooltip()
  }

  touchMove = (event) => {
    const { x, y } = touchPoint(this.svg, event)
    this.showTooltipAt(x, y)
  }

  mouseMove = (event) => {
    const { x, y } = localPoint(this.svg, event)
    this.showTooltipAt(x, y)
  }

  showTooltipAt = (x, y) => {
    const xMax = this.getXMax()
    const yMax = this.getYMax()

    const positionX = x - margin.left - padding.left
    const positionY = y - margin.top

    if (positionX < 0 || positionX > xMax || positionY < 0 || positionY > yMax) {
      this.closeTooltip()
      return
    }

    this.tooltipWidth = this.tooltip.getBoundingClientRect().width

    const dataPoints = this.props.series.map((seriesItem) => {
      const d = seriesItem.data
      const xDomain = this.xScale.invert(x - margin.left - padding.left)

      const index = bisectDate(d, xDomain, 1)

      const dLeft = d[index - 1]
      const dRight = d[index]

      const isRightCloser = xDomain - (new Date(dLeft.date)) > (new Date(dRight.date)) - xDomain

      const dataPoint = isRightCloser ? dRight : dLeft

      return {
        seriesItem,
        dataPoint
      }
    })

    const xOffset = 18
    const yOffset = 18

    const positionXWithOffset = positionX + xOffset
    const pastRightSide = positionXWithOffset + this.tooltipWidth > xMax
    const tooltipLeft = pastRightSide ? positionX - this.tooltipWidth - xOffset : positionXWithOffset

    const tooltipTop = positionY - yOffset

    this.setState({
      tooltipOpen: true,
      tooltipData: dataPoints,
      tooltipLeft,
      tooltipTop,
      vertLineLeft: this.xScale(new Date(dataPoints[0].dataPoint.date))
    })
  }

  closeTooltip = () => {
    this.setState({
      tooltipOpen: false
    })
  }

  getXMax(props = this.props) {
    return props.parentWidth - margin.left - margin.right - padding.left - padding.right
  }

  getYMax(props = this.props) {
    return (props.parentWidth * aspectRatio) - margin.top - margin.bottom
  }

  getXScale = (data, x, xMax, extentOverride) => {
    return scaleTime({
      domain: extentOverride || extent(data, x),
      range: [0, xMax]
    })
  }

  getYScale = (data, y, yMax, maxOverride) => {
    return scaleLinear({
      domain: [0, maxOverride || max(data, y)],
      range: [yMax, 0]
    })
  }

  getPathYFromX = (index, x) => {
    const path = this.pathRefs[index]

    return findPathYatX(x, path, index)
  }

  tickLabelProps = (val, i) => ({
    textAnchor: 'middle',
    fill: 'rgb(25, 29, 34)',
    opacity: '0.54',
    fontSize: 12,
    dy: '0.25em',
    fontWeight: 'bold'
  })

  render() {
    const {
      parentWidth,
      series
    } = this.props

    const {
      tooltipOpen,
      tooltipLeft,
      tooltipData,
      tooltipTop,
      vertLineLeft
    } = this.state

    const width = parentWidth
    const height = parentWidth * aspectRatio

    return (
      <div style={{ position: 'relative', WebkitFontSmoothing: 'antialiased' }}>
        <svg width={width} height={height} ref={this.setSvgRef}>
          <rect x={0} y={0} width={width} height={height} fill="white" />
          <Motion
            defaultStyle={{ maxY: max(this.allData, this.y) }}
            style={{ maxY: spring(max(this.allData, this.y)), end: max(this.allData, this.y) }}
          >
            {({ maxY, end }) => {
              const maxYRounded = Math.abs(maxY - end) < 0.005 ? end : maxY

              return (
                <GridRowsMem
                  top={margin.top}
                  left={margin.left}
                  scale={this.getYScale(this.allData, this.y, this.yMax, maxYRounded)}
                  numTicks={3}
                  width={this.xMax + padding.right + padding.left}
                />
              )
            }}
          </Motion>
          <GroupMem top={margin.top} left={margin.left + padding.left}>
            <Motion
              defaultStyle={{ left: 0, opacity: 0 }}
              style={{ left: spring(vertLineLeft || 0), opacity: spring(tooltipOpen ? 0.12 : 0) }}
            >
              {style => (
                <Line
                  from={{ x: style.left, y: 0 }}
                  to={{ x: style.left, y: this.yMax }}
                  stroke="rgb(25, 29, 34)"
                  opacity={style.opacity}
                />
              )}
            </Motion>

            {series.length === 1 && (
              <Motion
                defaultStyle={{ x: this.interpolateCount }}
                style={{ x: spring(this.interpolateCount, {
                  stiffness: 120, damping: 26
                }) }}
              >
                {({ x }) => {
                  const currentX = (x - this.interpolateCount) + 1
                  const path = this.pathInterpolator(currentX)
                  const areaPath = this.areaInterpolator(currentX)
                  const color = this.colorInterpolator(currentX)

                  return (
                    <g>
                      <defs>
                        <clipPath id="graph-clip">
                          <rect
                            x={2}
                            y={0}
                            width={width - margin.left - margin.right - padding.left - padding.right - 4}
                            height={height - margin.bottom - margin.top + 1}
                            fill="white"
                          />
                        </clipPath>
                      </defs>
                      <LinearGradient
                        id="line-gradient"
                        from={color}
                        to="white"
                        toOpacity={0.1}
                      />
                      <path
                        key="0"
                        data-index="0"
                        d={path}
                        stroke="transparent"
                        strokeWidth="2"
                        ref={this.setPathRef}
                        fill="none"
                      />
                      <path
                        d={areaPath}
                        stroke={color}
                        strokeWidth="2"
                        fill="url(#line-gradient)"
                        style={{ clipPath: 'url(#graph-clip)' }}
                      />
                    </g>
                  )
                }}
              </Motion>
            )}

            {series.length !== 1 && series.map((seriesItem, i) => (
              <LinePathMem
                key={i}
                data-index={i}
                data={seriesItem.data}
                xScale={this.xScale}
                yScale={this.yScale}
                x={this.x}
                y={this.y}
                curve={curveFunc}
                stroke={seriesItem.color}
                strokeLinecap="round"
                innerRef={this.setPathRef}
              />
            ))}

            <Motion
              defaultStyle={{ opacity: 0, x: vertLineLeft }}
              style={{
                opacity: spring(tooltipOpen ? 1 : 0),
                x: spring(vertLineLeft)
              }}
            >
              {style => tooltipData && (
                <g>
                  {tooltipData.map((point, i) => {
                    const y = this.getPathYFromX(i, style.x)

                    return (
                      <g key={i}>
                        <circle
                          cx={style.x}
                          cy={y}
                          r={12}
                          fill={point.seriesItem.color}
                          stroke={point.seriesItem.color}
                          strokeWidth=".6"
                          fillOpacity={style.opacity / 12}
                          strokeOpacity={style.opacity / 2}
                        />
                        <circle
                          cx={style.x}
                          cy={y}
                          r={4}
                          fill="white"
                          stroke={point.seriesItem.color}
                          strokeWidth="1.5"
                          fillOpacity={style.opacity}
                          strokeOpacity={style.opacity}
                        />
                      </g>
                    )
                  })}
                </g>
              )}
            </Motion>
            <rect
              x="0"
              y="0"
              width={this.xMax}
              height={this.yMax}
              fill="transparent"
              onMouseLeave={this.mouseLeave}
              onMouseMove={this.mouseMove}
              onTouchMove={this.touchMove}
            />
            <Delay initial={0} value={this.xMax} period={300}>
              {delayed => (
                <Motion defaultStyle={{ x: 0 }} style={{ x: spring(delayed) }}>
                  {style => (
                    <rect
                      x={style.x}
                      y="0"
                      width={Math.max(this.xMax - style.x, 0)}
                      height={this.yMax}
                      fill="white"
                    />
                  )}
                </Motion>
              )}
            </Delay>
          </GroupMem>
          <Motion
            defaultStyle={{ maxY: max(this.allData, this.y) }}
            style={{ maxY: spring(max(this.allData, this.y)), end: max(this.allData, this.y) }}
          >
            {({ maxY, end }) => {
              const maxYRounded = Math.abs(maxY - end) < 0.005 ? end : maxY

              return (
                <g>
                  <AxisLeftMem
                    top={margin.top}
                    left={margin.left}
                    scale={this.getYScale(this.allData, this.y, this.yMax, maxYRounded)}
                    hideTicks
                    hideAxisLine
                    numTicks={3}
                    stroke="#eaf0f6"
                    tickFormat={this.yScaleFormat}
                    tickLabelProps={this.tickLabelProps}
                  />
                  <AxisRightMem
                    top={margin.top}
                    left={parentWidth - margin.right}
                    scale={this.getYScale(this.allData, this.y, this.yMax, maxYRounded)}
                    hideTicks
                    hideAxisLine
                    numTicks={3}
                    stroke="#eaf0f6"
                    tickFormat={this.yScaleFormat}
                    tickLabelProps={this.tickLabelProps}
                  />
                </g>
              )
            }}
          </Motion>

          <Motion
            defaultStyle={{ minX: min(this.allData, this.x).getTime(), maxX: max(this.allData, this.x).getTime() }}
            style={{
              minX: spring(min(this.allData, this.x).getTime(), { stiffness: 210, damping: 20 }),
              maxX: spring(max(this.allData, this.x).getTime(), { stiffness: 210, damping: 20 }),
              minEnd: min(this.allData, this.x).getTime(),
              maxEnd: max(this.allData, this.x).getTime()
            }}
          >
            {({ minX, maxX, minEnd, maxEnd }) => {
              const minXNoBounce = minEnd // TODO: Figure out how to have no wobble and not have the
              const maxXNoBounce = maxEnd // end markers not take forever to show up

              return (
                <AxisBottomMem
                  top={height - margin.bottom}
                  left={margin.left + padding.left}
                  scale={this.getXScale(this.allData, this.x, this.xMax, [minXNoBounce, maxXNoBounce])}
                  hideTicks
                  stroke="#eaf0f6"
                  tickLabelProps={this.tickLabelProps}
                />
              )
            }}
          </Motion>
        </svg>
        <div
          style={{
            position: 'absolute',
            top: margin.top,
            left: margin.left,
            width: this.xMax,
            height: this.yMax,
            pointerEvents: 'none'
          }}
        >
          <Motion
            defaultStyle={{ left: tooltipLeft || 0, top: tooltipTop || 0, opacity: 0 }}
            style={{
              left: spring(tooltipLeft || 0),
              top: spring(tooltipTop || 0),
              opacity: spring(tooltipOpen ? 1 : 0)
            }}
          >
            {style => (
              <Tooltip
                innerRef={this.setTooltipRef}
                style={{
                  top: style.top,
                  left: style.left,
                  opacity: style.opacity
                }}
              >
                <div>
                  <strong>
                    {tooltipData && new Date(tooltipData[0].dataPoint.date).toLocaleDateString()}
                  </strong>
                  {tooltipData && tooltipData.map((point, i) => (
                    <div key={i}>
                      <span
                        style={{
                          display: 'inline-block',
                          borderRadius: '50%',
                          width: 8,
                          height: 8,
                          marginRight: 6,
                          backgroundColor: point.seriesItem.color
                        }}
                      />
                      {point.dataPoint.value}
                    </div>
                  ))}
                </div>
              </Tooltip>
            )}
          </Motion>
        </div>
      </div>
    )
  }
}

export default withParentSize(TrelloGraph)

import react from 'react';

var jsx = function () {
  var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7;
  return function createRawReactElement(type, props, key, children) {
    var defaultProps = type && type.defaultProps;
    var childrenLength = arguments.length - 3;

    if (!props && childrenLength !== 0) {
      props = {};
    }

    if (props && defaultProps) {
      for (var propName in defaultProps) {
        if (props[propName] === void 0) {
          props[propName] = defaultProps[propName];
        }
      }
    } else if (!props) {
      props = defaultProps || {};
    }

    if (childrenLength === 1) {
      props.children = children;
    } else if (childrenLength > 1) {
      var childArray = Array(childrenLength);

      for (var i = 0; i < childrenLength; i++) {
        childArray[i] = arguments[i + 3];
      }

      props.children = childArray;
    }

    return {
      $$typeof: REACT_ELEMENT_TYPE,
      type: type,
      key: key === undefined ? null : '' + key,
      ref: null,
      props: props,
      _owner: null
    };
  };
}();



var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();

// import glamorous from 'glamorous'
// import moize from 'moize'
// import { Line, LinePath, Bar } from '@vx/shape'
// import { Group } from '@vx/group'
// import { curveBasis } from '@vx/curve'
// import { withParentSize } from '@vx/responsive'
// import { AxisBottom, AxisLeft } from '@vx/axis'
// import { GridRows } from '@vx/grid'
// import { scaleTime, scaleLinear } from '@vx/scale'
// import { localPoint } from '@vx/event'
// import touchPoint from '@vx/event/build/touchPoint'
// import { Motion, spring, presets } from 'react-motion'
// import { extent, bisector, max } from 'd3-array'
// import shallowEqual from 'fbjs/lib/shallowEqual'

// import Delay from '../utils/Delay'
// import findPathYatX from '../utils/findPathYAtX'

var LineChart = (function () {
  return jsx('div', {}, void 0, 'heyyoo');
});

// memoizing components improves performance from 30fps to 50+fps on 5x throttled cpu
// const GridRowsMem = moize.reactSimple(GridRows)
// const GroupMem = moize.reactSimple(Group)
// const LinePathMem = moize.reactSimple(LinePath)
// const AxisLeftMem = moize.reactSimple(AxisLeft)
// const AxisBottomMem = moize.reactSimple(AxisBottom)

// const bisectDate = bisector(d => new Date(d.date)).left

// const colors = ['rgb(107, 157, 255)', 'rgb(252, 137, 159)']

// const data = [
//   { date: new Date(2017, 3, 1), value: 1 },
//   { date: new Date(2017, 4, 1), value: 2 },
//   { date: new Date(2017, 5, 1), value: 6 },
//   { date: new Date(2017, 6, 1), value: 3 },
//   { date: new Date(2017, 7, 1), value: 1 },
//   { date: new Date(2017, 8, 1), value: 5 },
// ]

// const data2 = [
//   { date: new Date(2017, 3, 1), value: 4 },
//   { date: new Date(2017, 4, 1), value: 4 },
//   { date: new Date(2017, 5, 1), value: 0 },
//   { date: new Date(2017, 6, 1), value: 1.5 },
//   { date: new Date(2017, 7, 1), value: 2 },
//   { date: new Date(2017, 8, 1), value: 1 },
// ]

// const series = [data, data2]
// const allData = series.reduce((acc, arr) => acc.concat(arr), [])

// const Container = glamorous('div', { shouldClassNameUpdate: () => false })({
//   backgroundColor: 'white'
// })

// const Tooltip = glamorous('div', { shouldClassNameUpdate: () => false })({
//   position: 'absolute',
//   backgroundColor: 'white',
//   color: 'rgba(25, 29, 34, 0.54)',
//   padding: 12,
//   fontSize: 14,
//   boxShadow: '0 4px 8px 0 rgba(25, 29, 34, 0.1)',
//   pointerEvents: 'none',
//   borderRadius: 3,
//   border: '1px solid rgba(25, 29, 34, 0.12)'
// })

// const aspectRatio = 0.5
// const margin = { top: 10, left: 15, bottom: 30, right: 35 }

// const axisLeftTickLabel = (
//   <text
//     fill="rgb(25, 29, 34)"
//     opacity="0.20"
//     fontSize={10}
//     dy="0.25em"
//     textAnchor="middle"
//     fontWeight="bold"
//   />
// )

// const axisBottomTickLabel = (
//   <text
//     fill="rgb(25, 29, 34)"
//     opacity="0.20"
//     fontSize={10}
//     dy="0.25em"
//     textAnchor="middle"
//     fontWeight="bold"
//   />
// )

// class TrelloGraph extends React.Component<any> {
//   state = {
//     tooltipOpen: false,
//     tooltipLeft: 0,
//     tooltipTop: 0,
//     tooltipData: null,
//     vertLineLeft: 0
//   }

//   tooltipWidth = 0

//   pathRefs = {}

//   componentWillMount() {
//     this.update()
//   }

//   componentWillReceiveProps(nextProps) {
//     if (!shallowEqual(this.props, nextProps)) {
//       this.update(nextProps)
//     }
//   }

//   update(props = this.props) {
//     this.xMax = this.getXMax(props)
//     this.yMax = this.getYMax(props)

//     this.xScale = this.getXScale(allData, this.x, this.xMax)
//     this.yScale = this.getYScale(allData, this.y, this.yMax)

//     this.yScaleFormat = this.yScale.tickFormat(3, '0')
//   }

//   x = d => d.date
//   y = d => d.value

//   setSvgRef = (ref) => {
//     this.svg = ref
//   }

//   setTooltipRef = (ref) => {
//     this.tooltip = ref

//     if (this.tooltip) {
//       this.tooltipWidth = ref.getBoundingClientRect().width
//     }
//   }

//   setPathRef = (ref) => {
//     if (!ref) {
//       this.pathRefs = null
//       return
//     }

//     this.pathRefs[ref.getAttribute('data-index')] = ref
//   }

//   mouseLeave = (event) => {
//     this.closeTooltip()
//   }

//   touchMove = (event) => {
//     const { x, y } = touchPoint(this.svg, event)
//     this.showTooltipAt(x, y)
//   }

//   mouseMove = (event) => {
//     const { x, y } = localPoint(this.svg, event);
//     this.showTooltipAt(x, y)
//   }

//   showTooltipAt = (x, y) => {
//     const xMax = this.getXMax()
//     const yMax = this.getYMax()

//     const positionX = x - margin.left
//     const positionY = y - margin.top

//     if (positionX < 0 || positionX > xMax || positionY < 0 || positionY > yMax) {
//       this.closeTooltip()
//       return
//     }

//     this.tooltipWidth = this.tooltip.getBoundingClientRect().width

//     const dataPoints = series.map((d) => {
//       const xDomain = this.xScale.invert(x - margin.left)

//       const index = bisectDate(d, xDomain, 1)

//       const dLeft = d[index - 1]
//       const dRight = d[index]

//       const isRightCloser = xDomain - (new Date(dLeft.date)) > (new Date(dRight.date)) - xDomain

//       return isRightCloser ? dRight : dLeft
//     })

//     const xOffset = 18
//     const yOffset = 18

//     const positionXWithOffset = positionX + xOffset
//     const pastRightSide = positionXWithOffset + this.tooltipWidth > xMax
//     const tooltipLeft = pastRightSide ? positionX - this.tooltipWidth - xOffset : positionXWithOffset

//     const tooltipTop = positionY - yOffset

//     this.setState({
//       tooltipOpen: true,
//       tooltipData: dataPoints,
//       tooltipLeft,
//       tooltipTop,
//       vertLineLeft: this.xScale(new Date(dataPoints[0].date))
//     })
//   }

//   closeTooltip = () => {
//     this.setState({
//       tooltipOpen: false
//     })
//   }

//   getXMax(props = this.props) {
//     return props.parentWidth - margin.left - margin.right
//   }

//   getYMax(props = this.props) {
//     return (props.parentWidth * aspectRatio) - margin.top - margin.bottom
//   }

//   getXScale = moize.simple((data, x, xMax) => {
//     return scaleTime({
//       domain: extent(data, x),
//       range: [0, xMax]
//     })
//   })

//   getYScale = moize.simple((data, y, yMax) => {
//     return scaleLinear({
//       domain: [0, max(data, y)],
//       range: [yMax, 0]
//     })
//   })

//   getPathYFromX = (index, x) => {
//     const path = this.pathRefs[index]

//     return findPathYatX(x, path, index)
//   }

//   render() {
//     const {
//       parentWidth
//     } = this.props

//     const {
//       tooltipOpen,
//       tooltipLeft,
//       tooltipData,
//       tooltipTop,
//       vertLineLeft
//     } = this.state

//     const width = parentWidth
//     const height = parentWidth * aspectRatio

//     return (
//       <div style={{ position: 'relative' }}>
//         <svg width={width} height={height} ref={this.setSvgRef}>
//           <rect x={0} y={0} width={width} height={height} fill="white" />
//           <GridRowsMem
//             top={margin.top}
//             left={margin.left}
//             scale={this.yScale}
//             numTicks={3}
//             width={this.xMax}
//           />
//           <GroupMem top={margin.top} left={margin.left}>
//             <Motion
//               defaultStyle={{ left: 0, opacity: 0 }}
//               style={{ left: spring(vertLineLeft || 0), opacity: spring(tooltipOpen ? 0.12 : 0) }}
//             >
//               {style => (
//                 <Line
//                   from={{ x: style.left, y: 0 }}
//                   to={{ x: style.left, y: this.yMax }}
//                   stroke="rgb(25, 29, 34)"
//                   opacity={style.opacity}
//                 />
//               )}
//             </Motion>
//             {series.map((seriesData, i) => (
//               <LinePathMem
//                 key={i}
//                 data-index={i}
//                 data={seriesData}
//                 xScale={this.xScale}
//                 yScale={this.yScale}
//                 x={this.x}
//                 y={this.y}
//                 curve={curveBasis}
//                 stroke={colors[i]}
//                 strokeLinecap="round"
//                 innerRef={this.setPathRef}
//               />
//             ))}
//             <Motion
//               defaultStyle={{ opacity: 0, x: vertLineLeft }}
//               style={{
//                 opacity: spring(tooltipOpen ? 1 : 0),
//                 x: spring(vertLineLeft)
//               }}
//             >
//               {style => tooltipData && (
//                 <g>
//                   {tooltipData.map((d, i) => {
//                     const y = this.getPathYFromX(i, style.x)

//                     return (
//                       <g key={i}>
//                         <circle
//                           cx={style.x}
//                           cy={y}
//                           r={12}
//                           fill={colors[i]}
//                           stroke={colors[i]}
//                           strokeWidth=".6"
//                           fillOpacity={style.opacity / 12}
//                           strokeOpacity={style.opacity / 2}
//                         />
//                         <circle
//                           cx={style.x}
//                           cy={y}
//                           r={4}
//                           fill="white"
//                           stroke={colors[i]}
//                           strokeWidth="1.5"
//                           fillOpacity={style.opacity}
//                           strokeOpacity={style.opacity}
//                         />
//                       </g>
//                     )
//                   })}
//                 </g>
//               )}
//             </Motion>
//             <rect
//               x="0"
//               y="0"
//               width={this.xMax}
//               height={this.yMax}
//               fill="transparent"
//               onMouseLeave={this.mouseLeave}
//               onMouseMove={this.mouseMove}
//               onTouchMove={this.touchMove}
//             />
//             <Delay initial={0} value={this.xMax} period={300}>
//               {delayed => (
//                 <Motion defaultStyle={{ x: 0 }} style={{ x: spring(delayed) }}>
//                   {style => (
//                     <rect
//                       x={style.x}
//                       y="0"
//                       width={Math.max(this.xMax - style.x, 0)}
//                       height={this.yMax}
//                       fill="white"
//                     />
//                   )}
//                 </Motion>
//               )}
//             </Delay>
//           </GroupMem>
//           <AxisLeftMem
//             top={margin.top}
//             left={margin.left}
//             scale={this.yScale}
//             hideTicks
//             hideAxisLine
//             numTicks={3}
//             stroke="#eaf0f6"
//             tickLabelComponent={axisLeftTickLabel}
//             tickFormat={this.yScaleFormat}
//           />
//           <AxisBottomMem
//             top={height - margin.bottom}
//             left={margin.left}
//             scale={this.xScale}
//             hideTicks
//             stroke="#eaf0f6"
//             tickLabelComponent={axisBottomTickLabel}
//           />
//         </svg>
//         <div
//           style={{
//             position: 'absolute',
//             top: margin.top,
//             left: margin.left,
//             width: this.xMax,
//             height: this.yMax,
//             pointerEvents: 'none'
//           }}
//         >
//           <Motion
//             defaultStyle={{ left: tooltipLeft || 0, top: tooltipTop || 0, opacity: 0 }}
//             style={{
//               left: spring(tooltipLeft || 0),
//               top: spring(tooltipTop || 0),
//               opacity: spring(tooltipOpen ? 1 : 0)
//             }}
//           >
//             {style => (
//               <Tooltip
//                 innerRef={this.setTooltipRef}
//                 style={{
//                   top: style.top,
//                   left: style.left,
//                   opacity: style.opacity
//                 }}
//               >
//                 <div>
//                   <strong>
//                     {tooltipData && new Date(tooltipData[0].date).toLocaleDateString()}
//                   </strong>
//                   {tooltipData && tooltipData.map((d, i) => (
//                     <div key={i}>
//                       <span
//                         style={{
//                           display: 'inline-block',
//                           borderRadius: '50%',
//                           width: 8,
//                           height: 8,
//                           marginRight: 6,
//                           backgroundColor: colors[i]
//                         }}
//                       />
//                       {d.value}
//                     </div>
//                   ))}
//                 </div>
//               </Tooltip>
//             )}
//           </Motion>
//         </div>
//       </div>
//     )
//   }
// }

// export default withParentSize(TrelloGraph)

export { LineChart };

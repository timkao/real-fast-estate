import React, { Component } from 'react';
import * as d3 from 'd3';
import { connect } from 'react-redux';
import lodash from 'lodash';

class LineChart extends Component {

  constructor(props) {
    super(props)
    this.renderAxis = this.renderAxis.bind(this);
    this.state = { data: this.props.data, transitionData: [] };
  }

  componentDidMount() {
    this.renderAxis()

  }
  componentDidUpdate() {
    this.renderAxis()
  }

  componentWillReceiveProps(nextProps) {
    if (!lodash.isEqual(nextProps.data, this.props.data) || nextProps.data.length !== this.state.transitionData.length) {
      const newData = nextProps.data;
      d3.selectAll(".line").transition().duration(1000).ease(d3.easeLinear).tween("attr.scale", () => {
        const interpolator = d3.interpolateNumber(0, newData.length);
        return (t) => {
          const endpoint = Math.floor(interpolator(t))
          this.setState({ data: newData, transitionData: newData.slice(0, endpoint) });
        }
      })
    }
  }

  renderAxis() {

    const { xScale, yScale } = this.props;

    const formatTime = d3.timeFormat("%Y %b");

    const xAxis = d3.axisBottom()
      .scale(xScale)
      .tickFormat(formatTime);

    const yAxis = d3.axisLeft()
      .scale(yScale)

    d3.select("#line-Xaxis").call(xAxis);
    d3.select("#line-Yaxis").call(yAxis);
  }


  render() {
    const { xScale, yScale, canvasHeight, canvasWidth, padding } = this.props;

    // data
    // const dataset = this.state.data;

    // tranistion
    let dataset = [];
    if (this.state.transitionData.length > 0) {
      dataset = this.state.transitionData;
    } else {
      dataset = this.state.data;
    }

    let onebed = [];
    let twobed = [];
    let threebed = [];
    let zerobed = [];
    let othersbed = [];
    dataset.forEach( property => {
      if (property.room == "0") {
        zerobed.push(property);
      } else if (property.room == "1") {
        onebed.push(property);
      } else if (property.room == "2") {
        twobed.push(property);
      } else if (property.room == "3") {
        threebed.push(property);
      } else {
        othersbed.push(property);
      }
    })
    // Line Generator
    const line = d3.line()
      .x(function (row) { return xScale(row.date) })
      .y(function (row) { return yScale(row.amount) })
      .curve(d3.curveBasis);

    const colors = ['steelblue','#605A64', '#781011', '#2D261C'];
    const lines = [zerobed, onebed, twobed, threebed];
    const descriptions = ['Zero/No Record', '1 Bedroom', '2 Bedroom', '3 Bedroom'];
    // legend

    const reclength = "20"

    return (
      <div>
        <svg id="line-chart" width={canvasWidth} height={canvasHeight}>
          {
            lines.map( (bedtype, i) => {
              return (
                <g key={colors[i]}>
                  <path className="line" d={line(bedtype)} stroke={colors[i]}></path>
                  {
                    bedtype.length !== 0 && <rect fill={colors[i]} x={padding + i * reclength * 1 + i * 120} y={0} width={reclength} height={reclength}></rect>
                  }
                  {
                    bedtype.length !== 0 && <text fill={colors[i]} x={padding + i * reclength * 1 + reclength * 1.2 + i * 120} y={reclength * 0.8} fontSize="14px">{descriptions[i]}</text>
                  }
                </g>
              )
            })
          }
          {/* <path className="line" d={line(zerobed)} stroke='steelblue'></path>
          <path className="line" d={line(onebed)} stroke='#605A64'></path>
          <path className="line" d={line(twobed)} stroke='#781011'></path>
          <path className="line" d={line(threebed)} stroke='#2D261C'></path> */}
          <g id="line-Xaxis" className="axis" transform={`translate(0, ${canvasHeight - padding} )`}></g>
          <g id="line-Yaxis" className="axis" transform={`translate(${padding}, 0)`}></g>
        </svg>
      </div>
    )
  }
}

const mapToState = function (state) {
  return {
  }
};

const mapToDispatch = function (dispatch) {
  return {
  }
};

const lineChartContainer = connect(mapToState, mapToDispatch)(LineChart);

export default lineChartContainer;

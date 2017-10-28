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

    let key = 0;

    return (
      <div>
        <svg id="line-chart" width={canvasWidth} height={canvasHeight}>
          <path className="line" d={line(zerobed)} stroke='black'></path>
          <path className="line" d={line(onebed)} stroke='red'></path>
          <path className="line" d={line(twobed)} stroke='blue'></path>
          <path className="line" d={line(threebed)} stroke='green'></path>
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

import React, { Component } from 'react';
import * as d3 from 'd3';
import { connect } from 'react-redux';

class LineChart extends Component {

  constructor(props) {
    super(props)
    this.renderAxis = this.renderAxis.bind(this);
    this.state = {data: this.props.data}
  }

  componentDidMount() {
    this.renderAxis()

  }
  componentDidUpdate() {
    this.renderAxis()
  }

  componentWillReceiveProps(nextProps) {

  }

  renderAxis() {
    const canvasWidth = 600;
    const canvasHeight = 300;
    const padding = 20;

    const dataset = this.state.data;

    const xScale = d3.scaleTime()
                     .domain([
                       d3.min(dataset, function(row){ return row.date}),
                       d3.max(dataset, function(row){ return row.date})
                     ])
                     .range([padding, canvasWidth]);

    const yScale = d3.scaleLinear()
                     .domain([300, d3.max(dataset, function(row){ return row.average})])
                     .range([canvasHeight - padding, 0]);

    const formatTime = d3.timeFormat("%Y");

    const xAxis = d3.axisBottom()
                    .scale(xScale)
                    .ticks(10)
                    .tickFormat(formatTime);

    const yAxis = d3.axisLeft()
                    .scale(yScale)
                    .ticks(10);

    d3.select("#line-Xaxis").call(xAxis);
    d3.select("#line-Yaxis").call(yAxis);
  }


  render() {
    // canvas setting
    const canvasWidth = 800;
    const canvasHeight = 300;
    const padding = 20;

    // data
    const dataset = this.state.data;

    // scale
    const xScale = d3.scaleTime()
                     .domain([
                       d3.min(dataset, function(row){ return row.date}),
                       d3.max(dataset, function(row){ return row.date})
                     ])
                     .range([padding, canvasWidth]);

    const yScale = d3.scaleLinear()
                     .domain([300, d3.max(dataset, function(row){ return row.average})])
                     .range([canvasHeight - padding, 0]);
    // label

    // Line Generator
    const line = d3.line()
                   .x(function(row){ return xScale(row.date)})
                   .y(function(row){ return yScale(row.average)});


    // const dangerLine = d3.line()
    //                .defined(function(row){ return row.average > 350})
    //                .x(function(row){ return xScale(row.date)})
    //                .y(function(row){ return yScale(row.average)});
    let key = 0;

    return (
      <div>
        <svg id="line-chart" width={canvasWidth} height={canvasHeight}>
          <path className="line" d={line(dataset)}></path>
          {/* <path className="dangerLine" d={dangerLine(dataset)}></path> */}
          {/* <line x1={padding} x2={canvasWidth} y1={yScale(350)} y2={yScale(350)} className="safeLevel"></line> */}
          {/* <text x={padding + 10} y={yScale(350) - 5}>350ppm "safe" level</text> */}
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

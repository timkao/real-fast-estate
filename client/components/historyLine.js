import React, { Component } from 'react';
import * as d3 from 'd3';
import { connect } from 'react-redux';

class HistoryLine extends Component {

  constructor(props) {
    super(props)
    this.renderAxis = this.renderAxis.bind(this);
  }

  componentDidMount() {
    this.renderAxis()

  }
  componentDidUpdate() {
    this.renderAxis()
  }

  renderAxis() {

    // const { xScale, yScale } = this.props;
    const canvasWidth = 600;
    const canvasHeight = 450;
    const padding = 60;
    const dataset = this.props.data;
    const parseTime = d3.timeParse("%Y-%m-%d");


    const xScale = d3.scaleTime()
      .domain([
        parseTime('2002-01-01'),
        parseTime('2017-12-31')
      ])
      .range([padding, canvasWidth]);

    const yScale = d3.scaleLinear()
      .domain([
        0,
        d3.max(dataset, function (row) { return row.amount }) + 100000
      ])
      .range([canvasHeight - padding, padding]);
    const formatTime = d3.timeFormat("%Y %b");

    const xAxis = d3.axisBottom()
      .scale(xScale)
      .tickFormat(formatTime)

    const yAxis = d3.axisLeft()
      .scale(yScale);

    d3.select("#historyline-Xaxis").call(xAxis);
    d3.select("#historyline-Yaxis").call(yAxis);
  }


  render() {
    const canvasWidth = 600;
    const canvasHeight = 450;
    const padding = 60;
    const dataset = this.props.data;
    const parseTime = d3.timeParse("%Y-%m-%d");
    const formatTime = d3.timeFormat("%Y %b");

    const xScale = d3.scaleTime()
    .domain([
      parseTime('2002-01-01'),
      parseTime('2017-12-31')
    ])
    .range([padding, canvasWidth]);

    const yScale = d3.scaleLinear()
      .domain([
        0,
        d3.max(dataset, function (row) { return row.amount }) + 100000
      ])
      .range([canvasHeight - padding, padding]);

    // Line Generator
    // const line = d3.line()
    //   .x(function (row) { return xScale(row.date) })
    //   .y(function (row) { return yScale(row.amount) })
    //   .curve(d3.curveLinear);
    console.log(dataset);

    return (
      <div>
        <svg id="historyline-chart" width={canvasWidth} height={canvasHeight}>
          <clipPath id="scatter-area">
            <rect x={padding} y={0} width={canvasWidth} height={canvasHeight - padding}></rect>
          </clipPath>
          <g clipPath="url(#scatter-area)">
          {
            dataset.map( point => {
              return (
                <circle key={point.date} cx={xScale(point.date)} cy={yScale(point.amount)} r={3} fill="#781011"></circle>
              )
            })
          }
          {
            dataset.map( point => {
              return (
                <text key={point.date} x={xScale(point.date) - 50} y={yScale(point.amount) + 20} stroke="#6795AF">{d3.format(',')(point.amount)}</text>
              )
            })
          }
          {
            dataset.map( point => {
              return (
                <text key={point.date} x={xScale(point.date) - 50} y={yScale(point.amount) + 40} stroke="#6795AF">{formatTime(point.date)}</text>
              )
            })
          }
          </g>
          <g id="historyline-Xaxis" className="axis" transform={`translate(0, ${canvasHeight - padding} )`}></g>
          <g id="historyline-Yaxis" className="axis" transform={`translate(${padding}, 0)`}></g>
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

const historyLineContainer = connect(mapToState, mapToDispatch)(HistoryLine);

export default historyLineContainer;


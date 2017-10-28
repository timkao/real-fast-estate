import React, { Component } from 'react';
import * as d3 from 'd3';
import { connect } from 'react-redux';

class BarChart extends Component {

  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      barData: this.props.data,
      labels: this.props.labels,
      rangeValue: 0
    }
  }

  componentWillReceiveProps(nextProps) {

    const begin = this.props.data;
    const end = nextProps.data;
    const newLabels = nextProps.labels;

    d3.selectAll("rect").transition().tween("attr.scale", null);
    d3.selectAll("rect").transition().duration(1000).ease(d3.easeLinear).tween("attr.scale", () => {

      // set interpolator
      const interpolators = end.map((endpoint, index) => {
        const startPoint = begin[index] || 0;
        return d3.interpolateNumber(startPoint, endpoint);
      })

      return (t) => {
        // reset state to trigger animation
        const newArr = interpolators.map(interpolator => {
          return interpolator(t);
        })
        this.setState({
          barData: newArr,
          labels: newLabels
        });
      }
    })
  }

  handleChange(evt) {
    const threshold = evt.target.value;
    this.setState({rangeValue: evt.target.value});
  }

  render() {

    // canvas setting
    const canvasWidth = 600;
    const canvasHeight = 300;
    const padding = 20;

    // data
    const dataset = this.state.barData;
    const _labels = this.state.labels;
    const labels = _labels.map( label => {
      const date = new Date(label)
      const timeFormat = d3.timeFormat("%Y-%b");
      return timeFormat(date);
    })

    // scale
    const xScale = d3.scaleBand()
      .domain(d3.range(dataset.length))
      .rangeRound([0, canvasWidth])
      .paddingInner(0.05);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(dataset)])
      .range([0, canvasHeight - padding]);

    // fill
    const threshold = this.state.rangeValue;

    let key = 0;

    return (
      <div className="row">
        <div className="col-lg-1">
          <p>
            <input onChange={this.handleChange} id="slider" type="range" min="0" max="25" step="1" value={this.state.rangeValue} orient="vertical" />
          </p>
        </div>
        <div className="col-lg-11">
          <svg id="bar-chart" width={canvasWidth} height={canvasHeight}>
            {
              dataset.map((data, index) => {
                return (
                  <rect key={key++} x={xScale(index)} y={canvasHeight - yScale(data)} width={xScale.bandwidth()} height={yScale(data)} fill={ data > threshold ? `rgb(0, 0, ${Math.round(data * 10)})` : "red" }>
                  </rect>
                )
              })
            }
            {
              dataset.map((data, index) => {
                return (
                  <text key={key++} textAnchor="middle" x={xScale(index) + xScale.bandwidth() / 2} y={canvasHeight - yScale(data) + 14} fill="white" fontSize="11px">
                    {Math.floor(data)}
                  </text>
                )
              })
            }
            {/* {
              labels.map((label, index) => {
                return (
                  (index === 0 || index === labels.length - 1) &&
                  <text key={key++} textAnchor={index === 0 ? "start" : "end" } x={ index === 0 ? xScale(index) : xScale(index) + xScale.bandwidth()} y={canvasHeight - 10} fill="black" fontSize="12px">
                    {label}
                  </text>
                )
              })
            } */}
          </svg>
        </div>
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

const barChartContainer = connect(mapToState, mapToDispatch)(BarChart);

export default barChartContainer;

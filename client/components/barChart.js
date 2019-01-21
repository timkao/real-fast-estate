import React, { Component } from 'react';
import * as d3 from 'd3';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class BarChart extends Component {

  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      barData: this.props.data,
      labels: this.props.labels,
      positions: this.props.positions,
      addresses: this.props.addresses,
      id: this.props.id,
      rangeValue: 0
    }
  }

  componentWillReceiveProps(nextProps) {

    const begin = this.props.data;
    const end = nextProps.data;
    const newLabels = nextProps.labels;
    const newPositions = nextProps.positions;
    const newAddresses = nextProps.addresses;
    const newId = nextProps.id;

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
          labels: newLabels,
          positions: newPositions,
          addresses: newAddresses,
          id: newId
        });
      }
    })
  }

  handleChange(evt) {
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
    const thresholdMax = d3.max(dataset);
    const threshold = this.state.rangeValue;
    let barFont;
    if (this.state.barData.length > 20) {
      barFont = "8px";
    } else {
      barFont = "12px";
    }
    let key = 0;

    return (
      <div className="row">
        <div className="col-lg-1">
          <p>
            <input title={this.state.rangeValue} onChange={this.handleChange} id="slider" type="range" min="10" max={thresholdMax} step="1" value={this.state.rangeValue} orient="vertical" />
          </p>
        </div>
        <div className="col-lg-11">
          <svg id="bar-chart" width={canvasWidth} height={canvasHeight}>
            {
              dataset.map((data, index) => {
                return (
                  <Link key={key++} to={`/property/${this.state.positions[index][0]}/${this.state.positions[index][1]}/${this.state.id[index]}`}><rect x={xScale(index)} y={canvasHeight - yScale(data)} width={xScale.bandwidth()} height={yScale(data)} fill={ data > threshold ? `#605A64` : "#781011" } className="bar-chart-rect">
                  </rect></Link>
                )
              })
            }
            {
              dataset.map((data, index) => {
                return (
                  <text key={key++} textAnchor="middle" x={xScale(index) + xScale.bandwidth() / 2} y={canvasHeight - yScale(data) + 14} fill="white" fontSize={barFont}>
                    {Math.floor(data)}
                  </text>
                )
              })
            }
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

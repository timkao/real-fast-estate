import React, { Component } from 'react';
import * as d3 from 'd3';
import { connect } from 'react-redux';

class PieChart extends Component {

  constructor(props) {
    super(props)
    this.state = { pieData: props.data, labels: this.props.labels }
  }

  render() {
    // canvas setting
    const canvasWidth = 500;
    const canvasHeight = 300;
    const padding = 20;

    // data
    const dataset = this.state.pieData;
    const pie = d3.pie().padAngle(0.06);
    // var color = d3.scaleOrdinal(d3.schemeCategory10);
    const color = ['#CB9190', '#BCCDDF', '#8F613F', '#5AA6A2', '#B3986B', '#797367'];
    const pieDataset = pie(dataset);

    // scale
    const outerRadius = (canvasWidth / 500) * 150;
    const innerRadius = 5;
    const arc = d3.arc()
      .cornerRadius(10)
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    // lengend
    const rectLength = "20";
    const labels = this.state.labels;

    return (
      <div>
        <svg width={canvasWidth} height={canvasHeight}>
          {
            pieDataset.map((data, i) => {
              return (
                <g key={i} className="arc" transform={`translate(${outerRadius}, ${outerRadius})`}>
                  <path fill={color[i]} d={arc(data)}></path>
                  <text textAnchor="middle" transform={`translate(${arc.centroid(data)})`}>
                    {data.value}
                  </text>
                  {
                    data.value !== 0 && <rect x={outerRadius + 5} y={i * 25 - outerRadius} height={rectLength} width={rectLength} fill={color[i]}></rect>
                  }
                  {
                    data.value !== 0 && <text x={ outerRadius + 10 + Number(rectLength) + 5} y={i * 25 - outerRadius + rectLength * 1 / 1.5} fontSize="10px">{labels[i]}</text>
                  }
                </g>
              )
            })
          }
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

const pieChartContainer = connect(mapToState, mapToDispatch)(PieChart);

export default pieChartContainer;

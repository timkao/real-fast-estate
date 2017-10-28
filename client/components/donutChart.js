import React, { Component } from 'react';
import * as d3 from 'd3';
import { connect } from 'react-redux';

class DonutChart extends Component {

  constructor(props) {
    super(props)
    this.state = { donutData: props.data, labels: props.labels }
  }

  componentWillReceiveProps(nextProps) {
    const begin = this.props.data;
    const end = nextProps.data;
    const newLabels = nextProps.labels;

    d3.selectAll(".arc").transition().tween("attr.scale", null);
    d3.selectAll(".arc").transition().duration(1000).ease(d3.easeLinear).tween("attr.scale", () => {

      // set interpolator
      const interpolators = end.map((endpoint, index) => {
        const startPoint = begin[index];
        return d3.interpolateNumber(startPoint, endpoint);
      })

      return (t) => {
        // reset state to trigger animation
        const newArr = interpolators.map(interpolator => {
          return interpolator(t);
        })
        this.setState({ donutData: newArr, labels: newLabels });
      }
    })
  }


  render() {
    // canvas setting
    const canvasWidth = 500;
    const canvasHeight = 300;
    const padding = 20;

    // data
    const dataset = this.state.donutData;
    const pie = d3.pie().sort(null);
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    const pieDataset = pie(dataset);


    // scale
    const outerRadius = (canvasWidth / 500) * 150;
    const innerRadius = outerRadius / 3;
    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    // legend
    const labels = this.state.labels.map( label => {
      if (label === "0") {
        return 'Studio o No Record';
      }
      else {
        return label + ' bedroom';
      }
    })
    const rectLength = "20";

    return (
      <div>
        <svg width={canvasWidth} height={canvasHeight}>
          {
            pieDataset.map((data, i) => {
              return (
                <g key={i} className="arc" transform={`translate(${outerRadius}, ${outerRadius})`}>
                  <path fill={color(i)} d={arc(data)}></path>
                  <text textAnchor="middle" transform={`translate(${arc.centroid(data)})`}>
                    {data.value !== 0 && Math.floor(data.value)}
                  </text>
                  {
                    data.value !== 0 && <rect x={outerRadius + 5} y={i * 25 - outerRadius} height={rectLength} width={rectLength} fill={color(i)}></rect>
                  }
                  {
                    data.value !== 0 && <text x={ outerRadius + 10 + Number(rectLength) + 5} y={i * 25 - outerRadius + rectLength * 1 / 1.5}>{labels[i]}</text>
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

const pieChartContainer = connect(mapToState, mapToDispatch)(DonutChart);

export default pieChartContainer;

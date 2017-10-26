import React, { Component } from 'react';
import { connect } from 'react-redux';

// Massage All the data here
class DashBoard extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { properties } = this.props;
    console.log(properties);

    // since 2016 years
    const datelimit = '2015-12-31';
    // by PropertyType "condo", "coop", "house"
    const recentRecords = properties.filter( property => {
      return Date.parse(property.sale.amount.salerecdate) > Date.parse(datelimit) && property.sale.amount.saletranstype !== "Nominal - Non/Arms Length Sale";
    })
    console.log(recentRecords);
    const typeMap = properties.reduce(function(acc, property){
      let currentType = property.summary.proptype;
      if (currentType !== undefined) {
        if (acc[currentType] === undefined) {
          acc[currentType] = 1;
        }
        else {
          acc[currentType] += 1;
        }
      }
      return acc;
    }, {})
    console.log(typeMap);
    return (
      <div>
        DashBoard
      </div>
    )
  }
}

const mapToState = (state) => {
  return {
    properties: state.properties,
    currentSpot: state.currentSpot,
    latLng: state.latLng
  }
}

const mapToProps = (dispatch) => {
  return {
  }
}

const dashBoardContainer = connect(mapToState, mapToProps)(DashBoard);

export default dashBoardContainer;

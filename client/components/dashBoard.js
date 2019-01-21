import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as d3 from 'd3';
import { connect } from 'react-redux';

import store, { saveProperties, getBarType, getRoomType, getPathType } from '../store';
import PieChart from './pieChart';
import BarChart from './barChart';
import DonutChart from './donutChart';
import LinePath from './linePath';
import { generatePieChartSource, generateBarChartSource, generateDonutChartSource } from './util';

// Massage All the data here
class DashBoard extends Component {

  componentDidMount() { // why do i did componentWillMount??
    const slimResult = this.props.properties.map(property => {
      return {
        address: property.address.oneLine,
        size: property.building.size.universalsize,
        saleAmount: property.sale.amount.saleamt,
        saleDate: property.sale.amount.salerecdate,
        saleType: property.sale.amount.saletranstype,
        type: property.summary.proptype,
        room: property.building.rooms.beds,
        propId: property.identifier.obPropId,
        perSqft: property.sale.calculation.pricepersizeunit,
        latitude: property.location.latitude,
        longtitude: property.location.longtitude
      }
    })
    const thunk = saveProperties(slimResult, this.props.latLng);
    store.dispatch(thunk);
  }

  render() {
    const { properties, updateBarType, updateRoomType, updatePathType, barType, roomType } = this.props;
    const recentRecords = properties.filter(property => {
      return property.sale.amount.saletranstype !== 'Nominal - Non/Arms Length Sale';
    })
    const _barChoices = ['CONDOMINIUM', 'TRIPLEX', 'DUPLEX'];
    const { pieLabels, piedata }
      = generatePieChartSource(properties);
    const { bardata, barChoices, barAverage, barActiveDecider, timeLabels, geoPositions, addresses, propIds }
      = generateBarChartSource(recentRecords, _barChoices, barType);
    const { donutLabels, donutdata, donutActiveDecider, donutChoices }
      = generateDonutChartSource(properties, _barChoices, roomType);

    // linePath chart data --------------------------------------
    const _properties = properties.filter(property => {
      return property.sale.amount.saletranstype !== "Nominal - Non/Arms Length Sale" && property.sale.amount.saleamt > 5000;
    })
    const parseTime = d3.timeParse("%Y-%m-%d");
    const _pathdata = _properties.map(property => {
      return {
        date: parseTime(property.sale.amount.salerecdate),
        amount: property.sale.amount.saleamt * 1 / 1000,
        type: property.summary.proptype,
        room: property.building.rooms.beds
      }
    })

    const pathChoices = _properties.reduce(function (acc, property) {
      const _proptype = property.summary.proptype;
      if (_barChoices.includes(_proptype) && !acc.includes(_proptype)) {
        acc.push(_proptype);
      }
      return acc;
    }, [])

    const pathObj = _pathdata.reduce(function (acc, property) {
      if (property.type !== undefined && acc[property.type] === undefined) {
        acc[property.type] = [property];
      } else if (property.type !== undefined) {
        acc[property.type].push(property);
      }
      return acc;
    }, {})
    let pathdata = [];
    if (pathChoices.includes(this.props.pathType)) {
      pathdata = pathObj[this.props.pathType];
    } else if (pathChoices.length !== 0) {
      pathdata = pathObj[pathChoices[0]];
    } else {
      pathdata = [];
    }
    if (pathdata.length > 2) {
      pathdata = pathdata.sort(function (a, b) {
        return a.date - b.date;
      })
    }
    pathdata = pathdata.filter(data => data.date > 0);
    // linePath chart data --------------------------------------

    return (
      <div>
        <div className="row">
          <div id="pie-area" className="col-lg-5">
            <h2 className="lead">Property Type</h2>
            <nav className="navbar navbar-default">
              <ul className="nav navbar-nav">
                <li></li>
              </ul>
            </nav>
            <PieChart data={piedata} labels={pieLabels} />
          </div>
          <div id="bar-area" className="col-lg-7">
            <h2 className="lead">Per Square Feet Price<Link to="/"><span className="pull-right"><i className="glyphicon glyphicon-home"></i></span></Link></h2>
            <nav className="navbar navbar-default">
              <ul className="nav navbar-nav">
                {
                  barChoices.map(type => {
                    return (
                      <li key={type} onClick={() => { updateBarType(type) }} className={type === barActiveDecider ? 'active' : 'inactive'} >{type}</li>
                    )
                  })
                }
              </ul>
              <ul id="bar-average" className="nav navbar-nav navbar-right">
                <li>Average: <span id="average-number">{`  $${barAverage}`}</span></li>
              </ul>
            </nav>
            <BarChart data={bardata} labels={timeLabels} choices={barChoices} positions={geoPositions} addresses={addresses} id={propIds} />
          </div>
        </div>
        <div className="row">
          <div id="donut-area" className="col-lg-5">
            <h2 className="lead">Room Type</h2>
            <nav className="navbar navbar-default">
              <ul className="nav navbar-nav">
                {
                  donutChoices.map(type => {
                    return (
                      <li key={type} onClick={() => { updateRoomType(type) }} className={type === donutActiveDecider ? 'active' : 'inactive'} >{type}</li>
                    )
                  })
                }
              </ul>
            </nav>
            <DonutChart data={donutdata} labels={donutLabels} choices={donutChoices} />
          </div>
          <div id="path-area" className="col-lg-7">
            <h2 className="lead">Total Sale Amount (in thousands)</h2>
            <nav className="navbar navbar-default">
              <ul className="nav navbar-nav">
                {
                  pathChoices.map(type => {
                    return (
                      <li key={type} onClick={() => { updatePathType(type) }} className={type === this.props.pathType ? 'active' : 'inactive'} >{type}</li>
                    )
                  })
                }
              </ul>
            </nav>
            <LinePath data={pathdata} type={this.props.pathType} />
          </div>
        </div>
      </div>

    )
  }
}

const mapToState = (state) => {
  return {
    properties: state.properties,
    currentSpot: state.currentSpot,
    latLng: state.latLng,
    barType: state.barType,
    roomType: state.roomType,
    pathType: state.pathType
  }
}

const mapToProps = (dispatch) => {
  return {
    updateBarType(type) {
      const action = getBarType(type);
      dispatch(action);
    },
    updateRoomType(type) {
      const action = getRoomType(type);
      dispatch(action);
    },
    updatePathType(type) {
      const action = getPathType(type);
      dispatch(action);
    }
  }
}

const dashBoardContainer = connect(mapToState, mapToProps)(DashBoard);

export default dashBoardContainer;

import React, { Component } from 'react';
import { connect } from 'react-redux';
import store, { saveProperties, getBarType, getRoomType, getPathType } from '../store';
import PieChart from './pieChart';
import BarChart from './barChart';
import DonutChart from './donutChart';
import * as d3 from 'd3';
import LinePath from './linePath';
import { Link } from 'react-router-dom';


// Massage All the data here
class DashBoard extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
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
    const { properties, updateBarType, updateRoomType, updatePathType } = this.props;
    console.log('properties', properties)

    const recentRecords = properties.filter(property => {
      return property.sale.amount.saletranstype !== "Nominal - Non/Arms Length Sale";
    })
    console.log('recentRecords: ', recentRecords);

    // pie chart data -------------------------------------------
    const typeMap = properties.reduce(function (acc, property) {
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
    const pieLabels = Object.keys(typeMap);
    const piedata = pieLabels.map(label => typeMap[label])
    console.log('data for pie chart: ', piedata);
    // pie chart data -------------------------------------------

    // bar chart data -------------------------------------------
    const _barChoices = ['CONDOMINIUM', 'TRIPLEX', 'DUPLEX'];
    const targetRecords = recentRecords.filter(property => {
      return property.sale.calculation.pricepersizeunit != 0
    })

    let barChoices = targetRecords.reduce(function (acc, property) {
      const _proptype = property.summary.proptype;
      if (_barChoices.includes(_proptype) && !acc.includes(_proptype)) {
        acc.push(_proptype);
      }
      return acc;
    }, [])

    const bardataObj = targetRecords.reduce(function (acc, property) {
      const proptype = property.summary.proptype;
      if (barChoices.includes(proptype)) {
        if (acc[proptype] === undefined) {
          acc[proptype] = [property];
        }
        else {
          acc[proptype].push(property);
        }
      }
      return acc
    }, {})

    barChoices.forEach(type => {
      bardataObj[type] = bardataObj[type].sort(function (propertyA, propertyB) {
        return Date.parse(propertyA.sale.amount.salerecdate) - Date.parse(propertyB.sale.amount.salerecdate)
      })
    });

    const bardata = [];
    const timeLabels = [];
    const geoPositions = [];
    const addresses = [];
    const propIds = [];
    let barActiveDecider;
    if (bardataObj[this.props.barType]) {
      bardataObj[this.props.barType].forEach(property => {
        if (property.sale.calculation.pricepersizeunit != 0) {
          bardata.push(property.sale.calculation.pricepersizeunit);
          timeLabels.push(property.sale.amount.salerecdate);
          geoPositions.push([property.location.latitude, property.location.longitude]);
          addresses.push(property.address.oneLine);
          propIds.push(property.identifier.obPropId);
        }
      })
      barActiveDecider = this.props.barType;
    }
    else if (barChoices.length !== 0) {
      bardataObj[barChoices[0]].forEach(property => {
        if (property.sale.calculation.pricepersizeunit != 0) {
          bardata.push(property.sale.calculation.pricepersizeunit);
          timeLabels.push(property.sale.amount.salerecdate);
        }
      })
      barActiveDecider = barChoices[0];
    }

    const barAverage = Math.round(bardata.reduce(function (acc, num) { return acc + num }, 0) / bardata.length, 1);

    console.log('raw bardata', bardataObj);
    console.log('bar choices', barChoices);
    console.log('data for bar chart: ', bardata);
    console.log('barType', this.props.barType);

    // bar chart data -------------------------------------------

    // donut chart data -----------------------------------------
    const roomType = { "0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, ">5": 0 };
    const donutChoices = properties.reduce(function (acc, property) {
      const _proptype = property.summary.proptype;
      if (_barChoices.includes(_proptype) && !acc.includes(_proptype)) {
        acc.push(_proptype);
      }
      return acc;
    }, [])
    console.log('donut choices ', donutChoices);
    const _roomMap = properties.reduce(function (acc, property) {
      const currRoomType = `${property.building.rooms.beds}`;
      const proptype = property.summary.proptype;
      if (_barChoices.includes(proptype) && !acc[proptype]) {
        acc[proptype] = Object.assign({}, roomType);
        acc[proptype][currRoomType] += 1;
      }
      else if (_barChoices.includes(proptype) && acc[proptype]) {
        if (currRoomType * 1 > 5) {
          acc[proptype][">5"] += 1
        } else {
          acc[proptype][currRoomType] += 1
        }
      }
      return acc;
    }, {})
    let roomMap = {};
    let donutActiveDecider;
    console.log('rooms types: ', _roomMap);
    if (_roomMap[this.props.roomType]) {
      roomMap = _roomMap[this.props.roomType];
      donutActiveDecider = this.props.roomType;
    } else if (donutChoices.length !== 0) {
      roomMap = _roomMap[donutChoices[0]];
      donutActiveDecider = donutChoices[0];
    }

    const donutLabels = Object.keys(roomMap);
    const donutdata = donutLabels.map(label => roomMap[label])
    console.log('donut data: ', donutdata);
    // donut chart data -----------------------------------------

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
    console.log(_pathdata);

    const pathChoices = _properties.reduce(function (acc, property) {
      const _proptype = property.summary.proptype;
      if (_barChoices.includes(_proptype) && !acc.includes(_proptype)) {
        acc.push(_proptype);
      }
      return acc;
    }, [])

    // const canvasWidth = 600;
    // const canvasHeight = 300;
    // const padding = 40;

    const pathObj = _pathdata.reduce(function (acc, property) {
      if (property.type !== undefined && acc[property.type] === undefined) {
        acc[property.type] = [property];
      } else if (property.type !== undefined) {
        acc[property.type].push(property);
      }
      return acc;
    }, {})
    console.log(pathObj);
    let pathdata = [];
    if (pathChoices.includes(this.props.pathType)) {
      console.log('---------------------')
      console.log(this.props.pathType);
      pathdata = pathObj[this.props.pathType];
    } else if (pathChoices.length !== 0) {
      console.log('xxxxxxxxxxxxxxxxxxxxx');
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
    console.log('path choices', pathChoices);
    console.log('path data: ', pathdata);

  //   const xScale = d3.scaleTime()
  //   .domain([
  //     d3.min(pathdata, function (row) { return row.date }),
  //     d3.max(pathdata, function (row) { return row.date })
  //   ])
  //   .range([padding, canvasWidth]);

  // const yScale = d3.scaleLinear()
  //   .domain([
  //     d3.min(pathdata, function (row) { return row.amount }),
  //     d3.max(pathdata, function (row) { return row.amount })
  //   ])
  //   .range([canvasHeight - padding, padding]);

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

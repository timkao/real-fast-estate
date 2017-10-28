import React, { Component } from 'react';
import { connect } from 'react-redux';
import store, { saveProperties, getBarType, getRoomType } from '../store';
import PieChart from './pieChart';
import BarChart from './barChart';
import DonutChart from './donutChart';

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
        type: property.summary.proptype
      }
    })
    const thunk = saveProperties(slimResult, this.props.latLng);
    store.dispatch(thunk);
  }

  render() {
    const { properties, updateBarType, updateRoomType } = this.props;

    // since 2015 years
    const datelimit = '2015-12-31';
    const recentRecords = properties.filter(property => {
      return Date.parse(property.sale.amount.salerecdate) > Date.parse(datelimit) && property.sale.amount.saletranstype !== "Nominal - Non/Arms Length Sale";
    })
    //console.log(recentRecords);

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
    const _barChoices = ['CONDOMINIUM', 'COOPERATIVE', 'SFR'];

    const barChoices = recentRecords.reduce(function (acc, property) {
      const _proptype = property.summary.proptype;
      if (_barChoices.includes(_proptype) && !acc.includes(_proptype)) {
        acc.push(_proptype);
      }
      return acc;
    }, [])
    console.log('bar choices', barChoices);
    const bardataObj = recentRecords.reduce(function (acc, property) {
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
    const bardata = []
    const timeLabels = []
    bardataObj[this.props.barType].forEach(property => {
      if (property.sale.calculation.pricepersizeunit != 0) {
        bardata.push(property.sale.calculation.pricepersizeunit);
        timeLabels.push(property.sale.amount.salerecdate);
      }
    })
    console.log('data for bar chart: ', bardata);
    console.log('barType', this.props.barType);

    // bar chart data -------------------------------------------

    // donut chart data -----------------------------------------
    const roomType = { "0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, ">5": 0 };
    const _roomMap = properties.reduce(function (acc, property) {
      const currRoomType = `${property.building.rooms.beds}`;
      const proptype = property.summary.proptype;
      if (barChoices.includes(proptype) && !acc[proptype]) {
        acc[proptype] = Object.assign({}, roomType);
        acc[proptype][currRoomType] += 1;
      }
      else if (barChoices.includes(proptype) && acc[proptype]) {
        if (currRoomType * 1 > 5) {
          acc[proptype][">5"] += 1
        } else {
          acc[proptype][currRoomType] += 1
        }
      }
      return acc;
    }, {})

    console.log('rooms types: ', _roomMap);
    const roomMap = _roomMap[this.props.roomType];
    const donutLabels = Object.keys(roomMap);
    const donutdata = donutLabels.map(label => roomMap[label])

    // donut chart data -----------------------------------------

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
            <h2 className="lead">Per Square Feet Price</h2>
            <nav className="navbar navbar-default">
              <ul className="nav navbar-nav">
                {
                  barChoices.map(type => {
                    return (
                      <li key={type} onClick={() => { updateBarType(type) }} className={type === this.props.barType ? 'active' : 'inactive'} >{type}</li>
                    )
                  })
                }
                <li className="navbar-right">Average: $XXX per Sqft</li>
              </ul>
            </nav>
            <BarChart data={bardata} labels={timeLabels} choices={barChoices} />
          </div>
        </div>
        <div className="row">
          <div id="donut-area" className="col-lg-5">
            <h2 className="lead">Room Type</h2>
            <nav className="navbar navbar-default">
              <ul className="nav navbar-nav">
                {
                  barChoices.map(type => {
                    return (
                      <li key={type} onClick={() => { updateRoomType(type) }} className={type === this.props.roomType ? 'active' : 'inactive'} >{type}</li>
                    )
                  })
                }
              </ul>
            </nav>
            <DonutChart data={donutdata} labels={donutLabels} />
          </div>
          <div className="col-lg-7">
            <h2 className="lead">Total Sale Amount</h2>
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
    roomType: state.roomType
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
    }
  }
}

const dashBoardContainer = connect(mapToState, mapToProps)(DashBoard);

export default dashBoardContainer;

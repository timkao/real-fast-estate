import React, { Component } from 'react';
import { connect } from 'react-redux';
import googleMap from './map';
import { Link } from 'react-router-dom';
import { fetchCurrentProperty } from '../store';
import HistoryLine from './historyLine';
import * as d3 from 'd3';


class SingleProperty extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { lat, lng, propId } = this.props.match.params;
    const map = new googleMap('map', lat * 1, lng * 1);
    this.props.getPropertyHistory(propId);
  }

  render() {

    const parseTime = d3.timeParse("%Y-%m-%d");
    let address;
    let historydata = [];
    let currentProperty;
    if (this.props.currentProperty.property) {
      currentProperty = this.props.currentProperty.property[0];
      address = currentProperty.address.oneLine;
      historydata = currentProperty.salehistory.map(history => {
        return {
          date: parseTime(history.amount.salerecdate),
          amount: history.amount.saleamt
        }
      }).filter(row => row.amount !== 0);
    }

    return (
      <div id="single-property-page">
        <h2 className="lead">{address}</h2>
        <div className="row">
          <nav className="navbar navbar-default">
            <ul className="nav navbar-nav">
              <li></li>
            </ul>
          </nav>
        </div>
        <div className="row summary">
          <div className="col-sm-6" id="map"></div>
          <div className="col-sm-6">
            {
              historydata.length !== 0 && <HistoryLine data={historydata} />
            }
          </div>
        </div>
        {
          historydata.length !== 0 && <div className="row detail">
            <ul className="list-group">
              <li className="list-group-item">
                <div className="row">
                  <div className="col-sm-3">Year Built:</div>
                  <div className="col-sm-3">{currentProperty.summary.yearbuilt}</div>
                  <div className="col-sm-3">Property Type:</div>
                  <div className="col-sm-3">{currentProperty.summary.proptype}</div>
                </div>
              </li>
              <li className="list-group-item">
                <div className="row">
                  <div className="col-sm-3">Total Square Feet:</div>
                  <div className="col-sm-3">{currentProperty.building.size.universalsize}</div>
                  <div className="col-sm-3">Number of Bed</div>
                  <div className="col-sm-3">{currentProperty.building.rooms.beds}</div>
                </div>
              </li>
              <li className="list-group-item">
                <div className="row">
                  <div className="col-sm-3">Address:</div>
                  <div className="col-sm-3">{`${currentProperty.address.line1}, ${currentProperty.address.locality}, ${currentProperty.address.countrySubd}`}</div>
                  <div className="col-sm-3">Zip Code:</div>
                  <div className="col-sm-3">{currentProperty.address.postal1}</div>
                </div>
              </li>
            </ul>
            <Link to="/dashboard"><p>Go back</p></Link>
          </div>
        }
      </div>
    )
  }
}

const mapToState = (state) => {
  return {
    currentProperty: state.currentProperty
  }
}

const mapToProps = (dispatch, ownProps) => {
  return {
    getPropertyHistory(id) {
      const thunk = fetchCurrentProperty(id * 1);
      dispatch(thunk);
    }
  }
}

const singlePropertyContainer = connect(mapToState, mapToProps)(SingleProperty);

export default singlePropertyContainer;



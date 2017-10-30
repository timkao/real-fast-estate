import React, { Component } from 'react';
import { connect } from 'react-redux';
import googleMap from './map';
import { Link } from 'react-router-dom';

class SingleProperty extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { lat, lng, address } = this.props.match.params;
    const map = new googleMap('map', lat * 1, lng * 1, address);
  }

  render() {
    return (
      <div>
      <div id="map">
      </div>
      <Link to="/dashboard"><p>Go back</p></Link>
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

const singlePropertyContainer = connect(mapToState, mapToProps)(SingleProperty);

export default singlePropertyContainer;



import React, { Component } from 'react';
import { connect } from 'react-redux';
import store, { getCurrentSpot, fetchLatLng } from './store';

class Main extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const input = document.getElementById('place-input');
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', function () {
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const name = place.formatted_address;
      store.dispatch(getCurrentSpot(name));
      store.dispatch(fetchLatLng([lat, lng]));
    });
  }

  handleSubmit(evt) {
    evt.preventDefault();
    console.log(this.props.currentSpot)
    console.log(this.props.latLng);
  }

  render() {
    return (
      <div className="container">
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Location</label>
            <input id="place-input" type="text" placeholder="Enter a location" className="form-control" autoComplete="off" name="location" />
            <input type="submit" className="btn btn-default" />
          </div>
        </form>
        <button onClick={this.props.getCurrentLocation} className="btn btn-primary">Tap to Grab Property</button>
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
    getCurrentLocation(evt) {
      evt.preventDefault();
      const thunk = fetchLatLng();
      dispatch(thunk);
      // pending update "currentSpot"
    }
  }
}

const mainContainer = connect(mapToState, mapToProps)(Main);

export default mainContainer;


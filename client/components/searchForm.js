import React, { Component } from 'react';
import { connect } from 'react-redux';
import store, {
  fetchNearProperties,
  insertAutoComplete,
  fetchPropertiesSales,
  getCurrentSpot,
  fetchLatLngAndProperty,
  fetchAddressByLatLng
} from '../store';
import { Route } from 'react-router-dom';

class SearchForm extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {showLoading: false};
  }

  componentDidMount() {
    const thunk = insertAutoComplete();
    store.dispatch(thunk);
  }

  handleSubmit(evt) {
    this.setState({showLoading: true});
    this.props.toDashBoard(evt, this.props.currentSpot, this.props.latLng);
  }

  render() {
    return (
      <div id="search-form">
        <form onSubmit={this.handleSubmit}>
          <div className="col-sm-6 col-sm-offset-3">
            <input id="place-input" type="text" placeholder="Enter a location or Tab for current location" autoComplete="off" name="location" />
            <button id="tap-button">Tap to Grab Property</button>
          </div>
        </form>
        {
          this.state.showLoading && <div className='waiting'>
            <p className='spinner'>
              Loading...
          </p>
          </div>
        }
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

const mapToProps = (dispatch, ownProps) => {
  return {
    toDashBoard(evt, spot, latLng) {
      evt.preventDefault(); // since it is "submit", this is to prevent page reload....
      if (evt.target.location.value === '') { // if the user do not type any address, we grab device location
        dispatch(getCurrentSpot(''));
        const thunk = fetchLatLngAndProperty(ownProps.history)
        dispatch(thunk);
      }
      else { // if user do search for a specific location, we send the longitude and latitude to our backend
        const [lat, lng] = latLng;
        const thunk2 = fetchAddressByLatLng([lat, lng, ownProps.history]);
        dispatch(thunk2);
        // const thunk2 = fetchPropertiesSales(spot, ownProps.history);
        // dispatch(thunk2);
      }
    }
  }
}

const searchFormContainer = connect(mapToState, mapToProps)(SearchForm);

export default searchFormContainer;

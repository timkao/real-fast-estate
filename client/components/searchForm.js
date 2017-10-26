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
import { Link } from 'react-router-dom';


class SearchForm extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const thunk = insertAutoComplete();
    store.dispatch(thunk);
  }

  handleSubmit(evt) {
    this.props.toDashBoard(evt, this.props.currentSpot, this.props.latLng);
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Location</label>
            <input id="place-input" type="text" placeholder="Enter a location" className="form-control" autoComplete="off" name="location" />
            <button className="btn btn-primary">Tap to Grab Property</button>
          </div>
        </form>
        <Link to="/dashboard">To dashboard</Link>
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
      evt.preventDefault();
      if (evt.target.location.value === '') {
        dispatch(getCurrentSpot(''));
        const thunk = fetchLatLngAndProperty(ownProps.history)
        dispatch(thunk);
      }
      else {
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

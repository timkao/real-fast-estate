import React, { Component } from 'react';
import { connect } from 'react-redux';
import store, {
  fetchNearProperties,
  insertAutoComplete,
  fetchPropertiesSales,
  getCurrentSpot,
  fetchLatLngAndProperty
} from '../store';


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
    evt.preventDefault();
    if (evt.target.location.value === '') {
      store.dispatch(getCurrentSpot(''));
      store.dispatch(fetchLatLngAndProperty());
    }
    else {
      const thunk = fetchPropertiesSales(this.props.currentSpot);
      store.dispatch(thunk);
    }
  }

  render() {
    return (
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Location</label>
            <input id="place-input" type="text" placeholder="Enter a location" className="form-control" autoComplete="off" name="location" />
            <button className="btn btn-primary">Tap to Grab Property</button>
          </div>
        </form>
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

const searchFormContainer = connect(mapToState, mapToProps)(SearchForm);

export default searchFormContainer;

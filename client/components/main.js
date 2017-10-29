import React, { Component } from 'react';
import { connect } from 'react-redux';
import SearchForm from './searchForm';
import { Route, Switch, withRouter } from 'react-router-dom';
import DashBoard from './dashBoard';


class Main extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container">
        <Switch>
          <Route exact path="/dashboard" component={DashBoard} />
          <Route exact path="/" component={SearchForm} />
        </Switch>
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

const mainContainer = withRouter(connect(mapToState, mapToProps)(Main));

export default mainContainer;


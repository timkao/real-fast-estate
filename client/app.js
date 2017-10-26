import ReactDOM from 'react-dom';
import Main from './main';
import React from 'react';
import { Provider } from 'react-redux';
import store from './store';

ReactDOM.render(
  <Provider store={store}>
    <Main />
  </Provider>,
  document.getElementById("app")
);

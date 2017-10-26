import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import properties from './properties';
import currentSpot from './currentSpot';
import latLng from './latLng';

const reducer = combineReducers({
  properties,
  currentSpot,
  latLng
});

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(
    thunkMiddleware,
    createLogger()
  ))
);

export default store;

export * from './properties';
export * from './currentSpot';
export * from './latLng';

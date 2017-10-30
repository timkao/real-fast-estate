import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import properties from './properties';
import currentSpot from './currentSpot';
import latLng from './latLng';
import barType from './barType';
import roomType from './roomType';
import pathType from './pathType';
import currentProperty from './currentProperty';

const reducer = combineReducers({
  properties,
  currentSpot,
  latLng,
  barType,
  roomType,
  pathType,
  currentProperty
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
export * from './barType';
export * from './roomType';
export * from './pathType';
export * from './currentProperty';


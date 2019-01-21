import axios from 'axios';
// action
const GET_PROPERTIES = 'GET_PROPERTIES';

// action creator
export const getProperties = (properties) => {
  return {
    type: GET_PROPERTIES,
    properties: properties
  }
}

export const fetchNearProperties = (address) => {
  const tempAddress = address.split(',');
  const address1 = encodeURIComponent(tempAddress[0]);
  const address2 = encodeURIComponent(tempAddress[1].slice(1) + ', ' + tempAddress[2].slice(1, 3).toLowerCase());
  return function(dispatch) {
    axios.post('/api/property', {address1, address2})
    .then( result => result.data)
    .then( propertyObj => {
      const action = getProperties(propertyObj.property);
      dispatch(action);
    })
  }
}

export const fetchPropertiesSales = (address, history) => {
  const tempAddress = address.split(',');
  const address1 = encodeURIComponent(tempAddress[0]);
  const address2 = encodeURIComponent(tempAddress[1].slice(1) + ', ' + tempAddress[2].slice(1, 3).toLowerCase());
  return function(dispatch) {
    axios.post('/api/property/sales', {address1, address2})
    .then( result => result.data)
    .then( propertyObj => {
      const action = getProperties(propertyObj.property);
      dispatch(action);
      history.push('/dashboard');
    })
  }
}

// save the properties information to database (Work In Progress)
export const saveProperties = (properties, center) => {
  return function(dispatch) {
    axios.post('/api/property/save', {mylist: properties, center})
    .then( result => result.data)
    .then( propertyList => {
      console.log(propertyList);
    })
  }
}

const reducer = ( state = [], action) => {
  switch (action.type) {
    case GET_PROPERTIES:
      return action.properties;
    default:
      return state;
  }
}

export default reducer;

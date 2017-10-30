import axios from 'axios';

// action
const GET_CURRENT_PROPERTY = 'GET_CURRENT_PROPERTY';

// action creator
export const getCurrentProperty = (property) => {
  return {
    type: GET_CURRENT_PROPERTY,
    currentProperty: property
  }
}

export const fetchCurrentProperty = (id) => {
  return function(dispatch) {
    axios.post('/api/property/history', {id})
    .then( result => result.data)
    .then( property => {
      const action = getCurrentProperty(property);
      dispatch(action);
    })
  }
}


const reducer = ( state = {}, action) => {
  switch (action.type) {
    case GET_CURRENT_PROPERTY:
      return action.currentProperty;
    default:
      return state;
  }
}

export default reducer;

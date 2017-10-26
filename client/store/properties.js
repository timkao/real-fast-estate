// action
const GET_PROPERTIES = 'GET_PROPERTIES';

// action creator
export const getProperties = (properties) => {
  return {
    type: GET_PROPERTIES,
    properties: properties
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

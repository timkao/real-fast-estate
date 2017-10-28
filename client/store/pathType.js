// action
const GET_PATH_TYPE = 'GET_PATH_TYPE';

// action creator
export const getPathType = (pathType) => {
  return {
    type: GET_PATH_TYPE,
    pathType: pathType
  }
}

const reducer = ( state = 'CONDOMINIUM', action) => {
  switch (action.type) {
    case GET_PATH_TYPE:
      return action.pathType;
    default:
      return state;
  }
}

export default reducer;

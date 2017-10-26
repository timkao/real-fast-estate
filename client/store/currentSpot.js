// action
const GET_CURRENT_SPOT = 'GET_CURRENT_SPOT';

// action creator
export const getCurrentSpot = (address) => {
  return {
    type: GET_CURRENT_SPOT,
    currentSpot: address
  }
}



const reducer = ( state = '', action) => {
  switch (action.type) {
    case GET_CURRENT_SPOT:
      return action.currentSpot;
    default:
      return state;
  }
}

export default reducer;

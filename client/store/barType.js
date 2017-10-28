// action
const GET_BAR_TYPE = 'GET_BAR_TYPE';

// action creator
export const getBarType = (barType) => {
  return {
    type: GET_BAR_TYPE,
    barType: barType
  }
}

const reducer = ( state = 'CONDOMINIUM', action) => {
  switch (action.type) {
    case GET_BAR_TYPE:
      return action.barType;
    default:
      return state;
  }
}

export default reducer;

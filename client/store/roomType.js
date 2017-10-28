// action
const GET_ROOM_TYPE = 'GET_ROOM_TYPE';

// action creator
export const getRoomType = (roomType) => {
  return {
    type: GET_ROOM_TYPE,
    roomType: roomType
  }
}

const reducer = ( state = 'CONDOMINIUM', action) => {
  switch (action.type) {
    case GET_ROOM_TYPE:
      return action.roomType;
    default:
      return state;
  }
}

export default reducer;

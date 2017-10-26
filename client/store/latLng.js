// action
const GET_LAT_LNG = 'GET_LAT_LNG';

// action creator
export const getLatLng = (latLng) => {
  return {
    type: GET_LAT_LNG,
    latLng: latLng
  }
}

export const fetchLatLng = () => {
  return function(dispatch) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        dispatch(getLatLng([position.coords.latitude, position.coords.longitude]));
      });
    } else {
      console.log('nothing...');
    }
  }
}

const reducer = ( state = [], action) => {
  switch (action.type) {
    case GET_LAT_LNG:
      return action.latLng;
    default:
      return state;
  }
}

export default reducer;

import { getCurrentSpot, fetchPropertiesSales } from './';
import axios from 'axios';

// action
const GET_LAT_LNG = 'GET_LAT_LNG';

// action creator
export const getLatLng = (latLng) => {
  return {
    type: GET_LAT_LNG,
    latLng: latLng
  }
}

export const fetchAddressByLatLng = ([lat, lng]) => {
  return function(dispatch) {
    axios.post('/api/property/address', {lat, lng})
    .then(result => result.data)
    .then( propertyObj => {
      const address = propertyObj.property[0].address.oneLine
      const action = getCurrentSpot(address);
      dispatch(action);
      const thunk = fetchPropertiesSales(address);
      dispatch(thunk);
    })
  }
}

export const fetchLatLngAndProperty = () => {
  return function(dispatch) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        dispatch(getLatLng([lat, lng]));
        dispatch(fetchAddressByLatLng([lat, lng]));
      });
    } else {
      console.log('nothing...');
    }
  }
}

export const insertAutoComplete = () => {
  return function(dispatch) {
    const input = document.getElementById('place-input');
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', function () {
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }
      console.log(place);
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const name = place.formatted_address;
        dispatch(getCurrentSpot(name));
        dispatch(getLatLng([lat, lng]));
    });
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

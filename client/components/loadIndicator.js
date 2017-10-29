import React from 'react';
import { connect } from 'react-redux';

const LoadingIndicator = ({ isLoading })=> {
  // if(!isLoading){
  //   return null;
  // }
  console.log(isLoading);
  return (
    <div className='waiting'>
      <p className='spinner'>
        Loading...
      </p>
    </div>
  );
};

const mapStateToProps = ({ latLng, currentSpot })=> {
  return {
    isLoading: latLng.length === 0 && currentSpot !== ''
  };
};


export default connect(mapStateToProps)(LoadingIndicator);

const router = require('express').Router();
const axios = require('axios');
const apikey = '08ebe91ec661e3835a9a469936689b89';


router.post('/property', (req, res, next) => {
  const radius = 0.1;
  // const propertyType = 'CONDOMINIUM';
  const orderby = 'distance';
  const page = 1;
  const pagesize = 100;
  const address1 = req.body.address1;
  const address2 = req.body.address2;

  axios.get(`https://search.onboard-apis.com/propertyapi/v1.0.0/property/address?address1=${address1}&address2=${address2}&radius=${radius}&orderby=${orderby}&page=${page}&pagesize=${pagesize}`, {
    headers: {
      'Accept': 'application/json',
      'apikey': apikey
    }
  })
  .then( result => result.data )
  .then( data => {
    res.send(data);
  })
  .catch(next);
})

router.post('/property/sales', (req, res, next) => {
  const radius = 0.1;
  // const propertyType = 'CONDOMINIUM';
  const orderby = 'distance';
  const page = 1;
  const pagesize = 300;
  const address1 = req.body.address1;
  const address2 = req.body.address2;

  axios.get(`https://search.onboard-apis.com/propertyapi/v1.0.0/sale/snapshot?address1=${address1}&address2=${address2}&radius=${radius}&minsaleamt=0&maxsaleamt=10000000&pagesize=${pagesize}&orderby=${orderby}`, {
    headers: {
      'Accept': 'application/json',
      'apikey': apikey
    }
  })
  .then( result => result.data )
  .then( data => {
    res.send(data);
  })
  .catch(next);
})

router.post('/property/address', (req, res, next) => {
  const radius = 0.1;
  // const propertyType = 'CONDOMINIUM';
  const orderby = 'distance';
  const page = 1;
  const pagesize = 5;
  const lat = req.body.lat;
  const lng = req.body.lng;

  axios.get(`https://search.onboard-apis.com/propertyapi/v1.0.0/property/snapshot?latitude=${lat}&longitude=${lng}&radius=${radius}&mintaxamt=0&maxtaxamt=1000000000&orderby=${orderby}&pagesize=${pagesize}`, {
    headers: {
      'Accept': 'application/json',
      'apikey': apikey
    }
  })
  .then( result => result.data )
  .then( data => {
    res.send(data);
  })
  .catch(next);
})



router.get('/property', (req, res, next) => {
  res.send('property api linked!');
})


module.exports = router;

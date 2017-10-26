const router = require('express').Router();
const axios = require('axios');
const apikey = '08ebe91ec661e3835a9a469936689b89';


router.post('/property', (req, res, next) => {

  const radius = 0.1;
  const propertyType = 'CONDOMINIUM';
  const orderby = 'distance';
  const page = 1;
  const pagesize = 100;
  const address = req.body.address;

  axios.get(`https://search.onboard-apis.com/propertyapi/v1.0.0/property/address?address1=803%20Sip%20Street&address2=union%20city%2C%20nj&radius=${radius}&propertytype=${propertyType}&orderby=${orderby}&page=${page}&pagesize=${pagesize}`, {
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

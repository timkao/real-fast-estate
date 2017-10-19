const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const axios = require('axios');
const apikey = '08ebe91ec661e3835a9a469936689b89';


app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.get('/data', (req, res, next) => {
  axios.get('https://search.onboard-apis.com/propertyapi/v1.0.0/property/snapshot?latitude=39.7047&longitude=-105.0814&radius=3', {
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

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'index.html'));
})

app.listen(port, function(){
  console.log(`listening on port ${3000}`);
})

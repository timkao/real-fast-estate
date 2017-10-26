const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const axios = require('axios');
const apikey = '08ebe91ec661e3835a9a469936689b89';
const router = require('./server/api/property');
const bodyParser = require('body-parser');

app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.use('/vendor', express.static(path.join(__dirname, 'node_modules')));
app.use('/public', express.static(path.join(__dirname, 'public')));

let config = process.env;
try {
  config = require('./env.json');
}
catch(ex){
  console.log('error!');
}

app.use(function(req, res, next){
  res.locals.GOOGLE_API_KEY = config.GOOGLE_API_KEY;
  next();
});

app.get('/data', (req, res, next) => {
  axios.get('https://search.onboard-apis.com/propertyapi/v1.0.0/property/address?address1=803%20Sip%20Street&address2=union%20city%2C%20nj&radius=0.1&propertytype=CONDOMINIUM&orderby=distance&page=1&pagesize=100', {
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


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/api', router);

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'index.html'));
})

app.use(function (err, req, res, next) {
  console.error(err.message)
  res.status(500).send('Something broke!')
})

app.listen(port, function(){
  console.log(`listening on port ${3000}`);
})

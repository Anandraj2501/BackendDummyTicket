var jsSHA = require('jssha');
const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
const {default: axios} = require('axios');
var urlencodedParser = bodyParser.urlencoded({extended: false});
const OrderConfirmed = require('../Models/OrderConfirmed');
const authenticate = require('../middleware/authenticate');

router.post('/', urlencodedParser,authenticate, async (req, res) => {
  var pd = req.body;
  const formData = new URLSearchParams();
  formData.append('key', pd.key);
  formData.append('txnid', pd.txnid);
  formData.append('amount', pd.amount);
  formData.append('productinfo', pd.productinfo);
  formData.append('firstname', pd.firstname);
  formData.append('email', pd.email);
  formData.append('phone', pd.phone);
  formData.append('surl', pd.surl);
  formData.append('furl', pd.furl);
  formData.append('hash', pd.hash);
  formData.append('service_provider', pd.service_provider);
    // console.log(formData);
//url for test environment is : https://test.payu.in/_payment, change it below
  try {
    const result = await axios.post('https://test.payu.in/_payment', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      
      },
    });
    // console.log(result);
    res.send(result.request.res.responseUrl);
  } catch (err) {
    console.log('error', err);
  }
});

module.exports = router;
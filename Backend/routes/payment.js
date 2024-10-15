var jsSHA = require('jssha');
const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
const authenticate = require("../middleware/authenticate");
const crypto = require('crypto');

router.post('/', urlencodedParser,authenticate, async (req, res) => {
  try {
    if (
      !req.body.txnid ||
      !req.body.amount ||
      !req.body.productinfo ||
      !req.body.firstname ||
      !req.body.email ||
      !req.body.udf1
    ) {
      console.log("missing");
      res.send('Mandatory fields missing');
    } else {
      var pd = req.body;
      var hashString =
      process.env.PAYMENT_KEY + // live or test key
        '|' +
        pd.txnid +
        '|' +
        pd.amount +
        '|' +
        pd.productinfo +
        '|' +
        pd.firstname +
        '|' +
        pd.email +
        '|' +
        pd.udf1 + 
        '||||||||||' + 
        process.env.SALT; //live or test salt
      var sha = new jsSHA('SHA-512', 'TEXT'); //encryption taking place
      sha.update(hashString);
      var hash = sha.getHash('HEX'); //hashvalue converted to hexvalue
      console.log(hash);
      res.send({hash: hash});
      // console.log(hashString);
      // const hash = crypto.createHash('sha512').update(hashString).digest('hex');
      // console.log(hash);
      // res.send({hash: hash});   //hashvalue is sent as response
    }
  } catch {
    console.log('error payment');
  }
});

module.exports = router;
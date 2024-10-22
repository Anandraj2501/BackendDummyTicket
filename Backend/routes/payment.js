var jsSHA = require('jssha');
const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
const authenticate = require("../middleware/authenticate");
const crypto = require('crypto');
const OrderConfirmed = require('../Models/OrderConfirmed');

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
      console.log(pd);
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
        '|' + 
        pd.udf2 +
        '|||||||||' + 
        process.env.SALT; //live or test salt
      var sha = new jsSHA('SHA-512', 'TEXT'); //encryption taking place
      sha.update(hashString);
      var hash = sha.getHash('HEX'); //hashvalue converted to hexvalue
      console.log(hash);
      
      // console.log(hashString);
      // const hash = crypto.createHash('sha512').update(hashString).digest('hex');
      // console.log(hash);
      // res.send({hash: hash});   //hashvalue is sent as response
      const newOrder = new OrderConfirmed({
        txnid: pd.txnid,
        status: 'pending', // Set status as pending initially
        amount: pd.amount,
        productinfo: pd.productinfo,
        firstname: pd.firstname,
        lastname: "",
        passengers: JSON.parse(pd.udf1), // Parse passengers from JSON string
        travellingDetails: JSON.parse(pd.udf2), // Parse travellingDetails from JSON string
      });
      await newOrder.save();

      res.send({hash: hash});

    }
  } catch(error) {
    console.log('error payment',error);
  }
});

module.exports = router;
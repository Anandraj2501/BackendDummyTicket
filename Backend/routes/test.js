var jsSHA = require('jssha');
const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
const { default: axios } = require('axios');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const OrderConfirmed = require('../Models/OrderConfirmed');
const authenticate = require('../middleware/authenticate');

// To verify the payment and save in your database
router.post('/', async (req, res) => {
  console.log("in");
  let passengerDetails = [];
  if (req.body.udf1) {
      try {
        // Decode the URL-encoded string
        const decodedPassengers = decodeURIComponent(req.body.udf1);
        // Replace HTML character entities with actual characters
        const cleanedPassengers = decodedPassengers.replace(/&quot;/g, '"');
        // Parse the cleaned JSON string
        passengerDetails = JSON.parse(cleanedPassengers);
      } catch (error) {
          console.error("Failed to parse passenger details:", error);
      }
  }
  console.log(passengerDetails);
  if (req.body.status == 'success') {
    try {
      const newOrder = new OrderConfirmed({
        country: req.body.country,
        mode: req.body.mode,
        error_Message: req.body.error_Message,
        state: req.body.state,
        bankcode: req.body.bankcode,
        txnid: req.body.txnid,
        net_amount_debit: req.body.net_amount_debit,
        lastname: req.body.lastname,
        zipcode: req.body.zipcode,
        phone: req.body.phone,
        productinfo: req.body.productinfo,
        hash: req.body.hash,
        status: req.body.status,
        firstname: req.body.firstname,
        city: req.body.city,
        isConsentPayment: req.body.isConsentPayment,
        error: req.body.error,
        addedon: req.body.addedon,
        encryptedPaymentId: req.body.encryptedPaymentId,
        bank_ref_num: req.body.bank_ref_num,
        key: req.body.key,
        email: req.body.email,
        amount: req.body.amount,
        unmappedstatus: req.body.unmappedstatus,
        address2: req.body.address2,
        payuMoneyId: req.body.payuMoneyId,
        address1: req.body.address1,
        mihpayid: req.body.mihpayid,
        giftCardIssued: req.body.giftCardIssued,
        field1: req.body.field1,
        cardnum: req.body.cardnum,
        field7: req.body.field7,
        field6: req.body.field6,
        field9: req.body.field9,
        field8: req.body.field8,
        amount_split: req.body.amount_split,
        field3: req.body.field3,
        field2: req.body.field2,
        field5: req.body.field5,
        PG_TYPE: req.body.PG_TYPE,
        field4: req.body.field4,
        name_on_card: req.body.name_on_card,
        passengers: passengerDetails
      });

      await newOrder.save();
      res.send({
        status: req.body.status,
        transaction_id: `Your transaction id is: ${req.body.mihpayid}. Kindly save it for any further query related to your placed order.`,
        message:
          "Congratulations! You'll shortly receive an acknowledgment email from us regarding your placed order. Thank you for buying; we are glad to serve you!",
      });
    } catch (err) {
      console.log("mongoerror");
      res.status(500).send('MongoDB could not save the data');
    }
  } else {
    console.log("payment unsuccessful");
    res.send({ status: 'Payment is not Successful' });
  }
});

module.exports = router;

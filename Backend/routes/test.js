var jsSHA = require('jssha');
const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
const {default: axios} = require('axios');
var urlencodedParser = bodyParser.urlencoded({extended: false});
const OrderConfirmed = require('../Models/OrderConfirmed');
const authenticate = require('../middleware/authenticate');
//To verify the payment and save in your database
router.post('/',authenticate, async (req, res) => {
    console.log("in")
  if (req.body.status == 'success') {
    const {
      country,
      mode,
      error_Message,
      state,
      bankcode,
      txnid,
      net_amount_debit,
      lastname,
      zipcode,
      phone,
      productinfo,
      hash,
      status,
      firstname,
      city,
      isConsentPayment,
      error,
      addedon,
      encryptedPaymentId,
      bank_ref_num,
      key,
      email,
      amount,
      unmappedstatus,
      address2,
      payuMoneyId,
      address1,
      mihpayid,
      giftCardIssued,
      field1,
      cardnum,
      field7,
      field6,
      field9,
      field8,
      amount_split,
      field3,
      field2,
      field5,
      PG_TYPE,
      field4,
      name_on_card,
    } = req.body;
    try {
      const newOrder = new OrderConfirmed({
        country: country,
        mode: mode,
        error_Message: error_Message,
        state: state,
        bankcode: bankcode,
        txnid: txnid,
        net_amount_debit: net_amount_debit,
        lastname: lastname,
        zipcode: zipcode,
        phone: phone,
        productinfo: productinfo,
        hash: hash,
        status: status,
        firstname: firstname,
        city: city,
        isConsentPayment: isConsentPayment,
        error: error,
        addedon: addedon,
        encryptedPaymentId: encryptedPaymentId,
        bank_ref_num: bank_ref_num,
        key: key,
        email: email,
        amount: amount,
        unmappedstatus: unmappedstatus,
        address2: address2,
        payuMoneyId: payuMoneyId,
        address1: address1,
        mihpayid: mihpayid,
        giftCardIssued: giftCardIssued,
        field1: field1,
        cardnum: cardnum,
        field7: field7,
        field6: field6,
        field9: field9,
        field8: field8,
        amount_split: amount_split,
        field3: field3,
        field2: field2,
        field5: field5,
        PG_TYPE: PG_TYPE,
        field4: field4,
        name_on_card: name_on_card,
      });

      await newOrder.save();
      res.send({
        status: req.body.status,
        transaction_id: `Your transaction id is: ${req.body.mihpayid}. Kindly save it for any further query related to your placed order.`,
        message:
          "Congratulations! You'll shortly receive an acknowledgment email from us regarding your placed order. Thank your for buying, We are glad to serve you! ",
      });
    } catch (err) {
        console.log("mongoerror");
      res.status(500).send('MongoDB could not save the data');
    }
  } else {
    console.log("paayment un");
    res.send({status: 'Payment is not Successful'});
  }
});
module.exports = router;
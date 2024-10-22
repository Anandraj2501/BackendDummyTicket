// var jsSHA = require('jssha');
// const express = require('express');
// const router = express.Router();
// var bodyParser = require('body-parser');
// const { default: axios } = require('axios');
// var urlencodedParser = bodyParser.urlencoded({ extended: false });
// const OrderConfirmed = require('../Models/OrderConfirmed');


// // To verify the payment and save in your database
// router.post('/', async (req, res) => {
//   // console.log("Incoming payment verification request");
//   // let travellingDetails = {};

//   // console.log(req.body,"reqbody");
//   // let passengerDetails = [];
//   // if (req.body.udf1) {
//   //   try {
//   //     // Decode the URL-encoded string
//   //     const decodedPassengers = decodeURIComponent(req.body.udf1);
//   //     // Replace HTML character entities with actual characters
//   //     const cleanedPassengers = decodedPassengers.replace(/&quot;/g, '"');
//   //     // Parse the cleaned JSON string
//   //     passengerDetails = JSON.parse(cleanedPassengers);


//   //   } catch (error) {
//   //     console.error("Failed to parse passenger details:", error);
//   //   }
//   // }
//   // console.log(passengerDetails);

//   // // Parsing travelling details from udf2
//   // if (req.body.udf2) {
//   //   try {
//   //     const decodedTravellingDetails = decodeURIComponent(req.body.udf2);
//   //     const cleanedTravellingDetails = decodedTravellingDetails.replace(/&quot;/g, '"');
//   //     travellingDetails = JSON.parse(cleanedTravellingDetails);
//   //   } catch (error) {
//   //     console.error("Failed to parse travelling details:", error);
//   //   }
//   // }

//   // console.log("Parsed Travelling Details:", travellingDetails);

//   // if (req.body.status === 'success') {
//   //   try {
//   //     // Create new order object
//   //     const newOrder = new OrderConfirmed({
//   //       country: req.body.country,
//   //       mode: req.body.mode,
//   //       error_Message: req.body.error_Message,
//   //       state: req.body.state,
//   //       bankcode: req.body.bankcode,
//   //       txnid: req.body.txnid,
//   //       net_amount_debit: req.body.net_amount_debit,
//   //       lastname: req.body.lastname,
//   //       zipcode: req.body.zipcode,
//   //       phone: req.body.phone,
//   //       productinfo: req.body.productinfo,
//   //       hash: req.body.hash,
//   //       status: req.body.status,
//   //       firstname: req.body.firstname,
//   //       city: req.body.city,
//   //       isConsentPayment: req.body.isConsentPayment,
//   //       error: req.body.error,
//   //       addedon: req.body.addedon,
//   //       encryptedPaymentId: req.body.encryptedPaymentId,
//   //       bank_ref_num: req.body.bank_ref_num,
//   //       key: req.body.key,
//   //       email: req.body.email,
//   //       amount: req.body.amount,
//   //       unmappedstatus: req.body.unmappedstatus,
//   //       address2: req.body.address2,
//   //       payuMoneyId: req.body.payuMoneyId,
//   //       address1: req.body.address1,
//   //       mihpayid: req.body.mihpayid,
//   //       giftCardIssued: req.body.giftCardIssued,
//   //       field1: req.body.field1,
//   //       cardnum: req.body.cardnum,
//   //       field7: req.body.field7,
//   //       field6: req.body.field6,
//   //       field9: req.body.field9,
//   //       field8: req.body.field8,
//   //       amount_split: req.body.amount_split,
//   //       field3: req.body.field3,
//   //       field2: req.body.field2,
//   //       field5: req.body.field5,
//   //       PG_TYPE: req.body.PG_TYPE,
//   //       field4: req.body.field4,
//   //       name_on_card: req.body.name_on_card,
//   //       passengers: passengerDetails,
//   //       travellingDetails: travellingDetails
//   //     });

//   //     // Save the order to the database
//   //     await newOrder.save();

//   //     res.status(200).send({
//   //       status: req.body.status,
//   //       transaction_id: `Your transaction ID is: ${req.body.mihpayid}. Kindly save it for any further query related to your placed order.`,
//   //       message: "Congratulations! You'll shortly receive an acknowledgment email from us regarding your placed order. Thank you for buying; we are glad to serve you!",
//   //     });
//   //   } catch (err) {
//   //     console.error("Error saving order to MongoDB:", err);
//   //     res.status(500).send('An error occurred while saving the order data');
//   //   }
//   // } else {
//   //   console.log("Payment unsuccessful");
//   //   res.status(400).send({
//   //     status: 'failure',
//   //     message: 'Payment was not successful. Please try again.',
//   //   });
//   // }
// });

// module.exports = router;

var jsSHA = require('jssha');
const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
const OrderConfirmed = require('../Models/OrderConfirmed');

// To verify the payment and update the order status
router.post('/', async (req, res) => {
  try {

    // Find the order by txnid
    const order = await OrderConfirmed.findOne({ txnid: req.body.txnid });
    // If the order exists and the payment status is 'success', update the status to 'paid'
    if (order) {
      await OrderConfirmed.findOneAndUpdate(
        { txnid: req.body.txnid },
        { status: 'paid' }
      );

      res.status(200).send(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Payment Success</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 50px auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9; }
              h1 { color: #4CAF50; }
              p { font-size: 16px; color: #333; }
              .order-details { margin-top: 20px; }
              .order-details p { font-weight: bold; }
              .thank-you { margin-top: 30px; font-size: 18px; color: #4CAF50; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Payment Successful</h1>
              <p>Your order has been successfully paid. Below are the details:</p>
              
              <div class="order-details">
                <p><strong>Transaction ID:</strong> ${req.body.txnid}</p>
                <p><strong>Amount:</strong> ${req.body.amount}</p>
                <p><strong>Name:</strong> ${req.body.firstname} ${order.lastname}</p>
              </div>

              <div class="thank-you">
                <p>Thank you for your purchase! You'll receive a confirmation email shortly.</p>
              </div>
              <a href="http://localhost:3000/downloadTicket?txnId=${req.body.txnid}" class="download-button">Download PDF</a>
            </div>
          </body>
        </html>
      `);
    } else if (!order) {
      res.status(404).send({
        status: 'failure',
        message: `Order with transaction ID: ${req.body.txnid} not found.`,
      });
    } else {
      res.status(400).send({
        status: 'failure',
        message: 'Payment was not successful. Please try again.',
      });
    }
  } catch (err) {
    console.error("Error processing payment:", err);
    res.status(500).send('An error occurred while processing the payment');
  }
});

module.exports = router;

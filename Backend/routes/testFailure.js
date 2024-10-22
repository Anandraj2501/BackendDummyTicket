// const express = require("express");
// const router = express.Router();
// const OrderConfirmed = require('../Models/OrderConfirmed'); // Import your OrderConfirmed model
// const bodyParser = require('body-parser');
// var urlencodedParser = bodyParser.urlencoded({ extended: false });

// router.post("/", urlencodedParser, async (req, res) => {
//     let passengerDetails = [];
//     let travellingDetails = {};

//     // Parse passenger details if they exist
//     if (req.body.udf1) {
//         try {
//             const decodedPassengers = decodeURIComponent(req.body.udf1);
//             const cleanedPassengers = decodedPassengers.replace(/&quot;/g, '"');
//             passengerDetails = JSON.parse(cleanedPassengers);
//         } catch (error) {
//             console.error("Failed to parse passenger details:", error);
//         }
//     }

//     // Parse travelling details if they exist
//     if (req.body.udf2) {
//         try {
//             const decodedTravellingDetails = decodeURIComponent(req.body.udf2);
//             const cleanedTravellingDetails = decodedTravellingDetails.replace(/&quot;/g, '"');
//             travellingDetails = JSON.parse(cleanedTravellingDetails);
//         } catch (error) {
//             console.error("Failed to parse travelling details:", error);
//         }
//     }

//     console.log("Payment Failure Details:", req.body);

//     // Save the failed payment details to the database
//     try {
//         const failedOrder = new OrderConfirmed({
//             country: req.body.country || "",
//             mode: req.body.mode || "Unknown",
//             error_Message: req.body.error_Message || "Payment failed",
//             state: req.body.state || "",
//             bankcode: req.body.bankcode || "",
//             txnid: req.body.txnid || "",
//             net_amount_debit: req.body.net_amount_debit || "0",
//             lastname: req.body.lastname || "",
//             zipcode: req.body.zipcode || "",
//             phone: req.body.phone || "",
//             productinfo: req.body.productinfo || "",
//             hash: req.body.hash || "",
//             status: req.body.status || "failed",
//             firstname: req.body.firstname || "",
//             city: req.body.city || "",
//             isConsentPayment: req.body.isConsentPayment || false,
//             error: req.body.error || "Unknown error",
//             addedon: req.body.addedon || new Date(),
//             encryptedPaymentId: req.body.encryptedPaymentId || "",
//             bank_ref_num: req.body.bank_ref_num || "",
//             key: req.body.key || "",
//             email: req.body.email || "",
//             amount: req.body.amount || "0",
//             unmappedstatus: req.body.unmappedstatus || "",
//             address2: req.body.address2 || "",
//             payuMoneyId: req.body.payuMoneyId || "",
//             address1: req.body.address1 || "",
//             mihpayid: req.body.mihpayid || "",
//             giftCardIssued: req.body.giftCardIssued || false,
//             field1: req.body.field1 || "",
//             cardnum: req.body.cardnum || "",
//             field7: req.body.field7 || "",
//             field6: req.body.field6 || "",
//             field9: req.body.field9 || "",
//             field8: req.body.field8 || "",
//             amount_split: req.body.amount_split || "",
//             field3: req.body.field3 || "",
//             field2: req.body.field2 || "",
//             field5: req.body.field5 || "",
//             PG_TYPE: req.body.PG_TYPE || "",
//             field4: req.body.field4 || "",
//             name_on_card: req.body.name_on_card || "",
//             passengers: passengerDetails, // Store parsed passenger details
//             travellingDetails: travellingDetails, // Store parsed travelling details
//             paymentStatus: 'failed', // Indicate the payment status as 'failed'
//         });

//         await failedOrder.save();

//         res.send({
//             status: 'Payment failed',
//             message: "Your payment was unsuccessful. Please try again or contact support for assistance.",
//         });
//     } catch (err) {
//         console.log("Error saving failure details:", err);
//         res.status(500).send('Could not save the failure data to the database');
//     }
// });

// module.exports = router;

var jsSHA = require('jssha');
const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
const OrderConfirmed = require('../Models/OrderConfirmed');

// To verify the payment and update the order status in case of failure
router.post('/', async (req, res) => {
  try {
    console.log("Incoming payment verification request for failure case");

    // Find the order by txnid
    const order = await OrderConfirmed.findOne({ txnid: req.body.txnid });

    // If the order exists and the payment status is 'failure', update the status to 'failed'
    if (order && req.body.status === 'failure') {
      await OrderConfirmed.findOneAndUpdate(
        { txnid: req.body.txnid }, 
        { status: 'failed', error_Message: req.body.error || "Payment failed" }, // Mark the payment as failed
        { new: true }
      );

      console.log(`Order with txnid ${req.body.txnid} has been updated to 'failed'.`);

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
              h1 { color: #FF0000; }
              p { font-size: 16px; color: #333; }
              .order-details { margin-top: 20px; }
              .order-details p { font-weight: bold; }
              .thank-you { margin-top: 30px; font-size: 18px; color: #4CAF50; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Payment Failed</h1>
              <p>Your order has been failed. Below are the details:</p>
              
              <div class="order-details">
                <p><strong>Transaction ID:</strong> ${req.body.txnid}</p>
                <p><strong>Amount:</strong> ${req.body.amount}</p>
                <p><strong>Name:</strong> ${req.body.firstname} ${order.lastname}</p>
              </div>

              <div class="thank-you">
                <p>Thank you for your purchase! You'll receive a confirmation email shortly.</p>
              </div>
            </div>
          </body>
        </html>
      `)
    } else if (!order) {
      res.status(404).send({
        status: 'failure',
        message: `Order with transaction ID: ${req.body.txnid} not found.`,
      });
    } else {
      console.log("Payment status mismatch or already paid");
      res.status(400).send({
        status: 'failure',
        message: 'Order was not found or payment status does not match.',
      });
    }
  } catch (err) {
    console.error("Error processing payment failure:", err);
    res.status(500).send('An error occurred while processing the payment failure');
  }
});

module.exports = router;

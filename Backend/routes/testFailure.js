const express = require("express");
const router = express.Router();
const OrderConfirmed = require('../Models/OrderConfirmed'); // Import your OrderConfirmed model
const bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.post("/", urlencodedParser, async (req, res) => {
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

    console.log("Payment Failure Details:", req.body);
    
    // Save failure details to the database if needed
    try {
        const failedOrder = new OrderConfirmed({
            country: req.body.country,
            mode: req.body.mode || "Unknown",
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
            passengers: passengerDetails, // Store parsed passenger details
            paymentStatus: 'failed', // Indicate the payment status
        });

        await failedOrder.save();
        res.send({
            status: 'Payment failed',
            message: "Your payment was unsuccessful. Please try again or contact support for assistance."
        });
    } catch (err) {
        console.log("Error saving failure details:", err);
        res.status(500).send('Could not save the failure data to the database');
    }
});

module.exports = router;

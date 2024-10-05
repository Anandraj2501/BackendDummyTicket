const mongoose = require("mongoose");

const OrderConfirmSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    country: {
      type: String,
    },

    mode: {
      type: String,
    },
    error_Message: {
      type: String,
    },
    state: {
      type: String,
    },
    bankcode: {
      type: String,
    },
    txnid: {
      type: String,
    },
    net_amount_debit: {
      type: String,
    },
    lastname: {
      type: String,
    },
    zipcode: {
      type: String,
    },
    phone: {
      type: String,
    },
    productinfo: {
      type: String,
    },
    hash: {
      type: String,
    },
    status: {
      type: String,
    },
    firstname: {
      type: String,
    },
    city: {
      type: String,
    },
    isConsentPayment: {
      type: String,
    },
    error: {
      type: String,
    },
    addedon: {
      type: String,
    },

    encryptedPaymentId: {
      type: String,
    },
    bank_ref_num: {
      type: String,
    },
    key: {
      type: String,
    },
    email: {
      type: String,
    },
    amount: {
      type: String,
    },
    unmappedstatus: {
      type: String,
    },
    address2: {
      type: String,
    },
    payuMoneyId: {
      type: String,
    },
    address1: {
      type: String,
    },

    mihpayid: {
      type: String,
    },

    giftCardIssued: {
      type: String,
    },
    field1: {
      type: String,
    },
    cardnum: {
      type: String,
    },
    field7: {
      type: String,
    },
    field6: {
      type: String,
    },
    field9: {
      type: String,
    },
    field8: {
      type: String,
    },
    amount_split: {
      type: String,
    },
    field3: {
      type: String,
    },
    field2: {
      type: String,
    },
    field5: {
      type: String,
    },
    PG_TYPE: {
      type: String,
    },
    field4: {
      type: String,
    },
    name_on_card: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("confirmed_orders", OrderConfirmSchema);
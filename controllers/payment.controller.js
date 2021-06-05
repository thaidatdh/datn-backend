const mongoose = require("mongoose");
const { SEARCH } = require("../constants/constants");
const constants = require("../constants/constants");
const { v1: uuidv1 } = require("uuid");
const QRCode = require("qrcode");
const crypto = require("crypto");
const https = require("https");
const { default: axios } = require("axios");

//MOMO CONFIG API
const config = {
  partner_code: process.env.MOMO_PARTNER_CODE,
  access_key: process.env.MOMO_ACCESSKEY,
  secret_key: process.env.MOMO_SECRETKEY,
  return_url: process.env.MOMO_RETURN_URL,
  notify_url: process.env.MOMO_NOTIFY_URL,
  endpoint: process.env.MOMO_ENDPOINT,
  hostname: process.env.MOMO_HOSTNAME,
};
//END

exports.generateQrCode = async function (req, res) {
  try {
    /****** PARAMS ******/
    const orderId = uuidv1(); //AUTO GENERATE
    const requestId = uuidv1(); //AUTO GENERATE
    const amount = 1000; //TREATMENT AMOUNT
    const orderInfo = "Pay with MoMo"; //DESCRIPTION
    const extraData = "merchantName=Payment"; //pass empty value if your merchant does not have stores else merchantName=[storeName]; merchantId=[storeId] to identify a transaction map with a physical store

    const rawSignature =
      "partnerCode=" +
      config.partner_code +
      "&accessKey=" +
      config.access_key +
      "&requestId=" +
      requestId +
      "&amount=" +
      amount +
      "&orderId=" +
      orderId +
      "&orderInfo=" +
      orderInfo +
      "&returnUrl=" +
      config.return_url +
      "&notifyUrl=" +
      config.notify_url +
      "&extraData=" +
      extraData;

    var signature = crypto
      .createHmac("sha256", config.secret_key)
      .update(rawSignature)
      .digest("hex");
    var requestType = "captureMoMoWallet";
    /******  END   ******/

    //ORDER DATA
    var body = JSON.stringify({
      partnerCode: config.partner_code,
      accessKey: config.access_key,
      requestId: requestId,
      amount: `${amount}`,
      orderId: orderId,
      orderInfo: orderInfo,
      returnUrl: config.return_url,
      notifyUrl: config.notify_url,
      extraData: extraData,
      requestType: requestType,
      signature: signature,
    });

    //Create the HTTPS objects
    var options = {
      hostname: config.hostname,
      port: 443,
      path: "/gw_payment/transactionProcessor",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };

    //SEND PAYMENT REQUEST TO MOMO SERVER
    const response = await axios.post(
      `${options.hostname}${options.path}`,
      body,
      { headers: options.headers }
    );

    //GENERATE QR CODE
    QRCode.toDataURL(`${response.data.qrCodeUrl}`, (err, url) => {
      return res.json({ success: true, payload: url });
    });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
};

exports.callbackNotifyMomo = async function (req, res) {
  try {
    //MOMO REQUEST BODY
    const body = req.body;

    /****** UPDATE DATABASE ******/
    // DO SOMETHING
    /******       END      *******/

    //THE PARTNER SERVER NEEDS TO REPLY BACK TO THE MOMO SERVER TO KNOW THE STATUS OF THE ORDER HAS BEEN RECORDED
    return res.status(200).json({
      status: 0,
      message: body.localMessage,
      amount: body.amount,
      partnerRefId: "", //PARTNER ORDER ID
      momoTransId: body.transId,
      signature: body.signature,
    });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
};

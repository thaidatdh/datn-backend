const mongoose = require("mongoose");
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

exports.generateQrCode = async (amount, transaction_id) => {
  try {
    /****** PARAMS ******/
    const orderId = transaction_id; // uuidv1(); //AUTO GENERATE
    const requestId = uuidv1(); //AUTO GENERATE
    const orderInfo = "[ADC] Payment"; //DESCRIPTION
    const extraData = "transaction_id=" + transaction_id + ";"; //pass empty value if your merchant does not have stores else merchantName=[storeName]; merchantId=[storeId] to identify a transaction map with a physical store

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
      "&payType=qr" +
      "&extraData=" +
      extraData;

    const signature = crypto
      .createHmac("sha256", config.secret_key)
      .update(rawSignature)
      .digest("hex");
    const requestType = "captureMoMoWallet";
    /******  END   ******/

    //ORDER DATA
    const body = JSON.stringify({
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
      payType: "qr",
    });

    //Create the HTTPS objects
    const options = {
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
    const qrCodeUrl = await QRCode.toDataURL(`${response.data.qrCodeUrl}`);
    return qrCodeUrl;
  } catch (error) {
    return "";
  }
};

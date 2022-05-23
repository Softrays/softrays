// import request from "request";

const paystack = (request) => {
  const MySecretKey = process.env.PAYSTACK_SECRET_KEY;

  //   Initialize payment
  const initializePayment = (form, mycallback) => {
    const options = {
      url: "https://api.paystack.co/transaction/initialize",
      headers: {
        Authorization: `Bearer ${MySecretKey}`,
        "content-type": "application/json",
        "cache-control": "no-cache",
      },
      form,
    };
    const callback = (error, response, body) => {
      return mycallback(error, body);
    };
    request.post(options, callback);
  };

  //   Verify Payment
  const verifyPayment = (ref, mycallback) => {
    // console.log(`Ref: ${encodeURIComponent(ref)}`);
    const options = {
      url:
        "https://api.paystack.co/transaction/verify/" + encodeURIComponent(ref),
      headers: {
        Authorization: `Bearer ${MySecretKey}`,
        "content-type": "application/json",
        "cache-control": "no-cache",
      },
    };
    const callback = (error, response, body) => {
      return mycallback(error, body);
    };
    request(options, callback);
  };
  return { initializePayment, verifyPayment };
};

module.exports = paystack;

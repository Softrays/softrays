const express = require("express");
const router = express.Router();

const mailchimp = require("@mailchimp/mailchimp_marketing");

router.get("/", (req, res) => {
  res.render("index");
});

router.post("/", (req, res) => {
  const {email} = req.body;

  //  INTEGRATING MAILCHIMP API
  mailchimp.setConfig({
    apiKey: "5897a554a7510fd1cc0538de6b310dc1-us19",
    server: "us19",
  });

  const listId = "2d307f8247";
  const subscribingUser = {
    email: email,
  };

  async function run() {
    const response = await mailchimp.ping.get();
    console.log(response);

    try {
      const response = await mailchimp.lists.addListMember(listId, {
        email_address: subscribingUser.email,
        status: "subscribed",
      });

      if (response.status === "subscribed") {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
      // response.status === 200 ?
    } catch (err) {
      console.log(err);
    }
  }

  run();
});



module.exports = router;

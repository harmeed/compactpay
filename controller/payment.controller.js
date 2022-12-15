const https = require("follow-redirects").https;
const fs = require("fs");



exports.payment = async(req, res)=>{
    try {
        const options = {
          method: "POST",
          hostname: "api.paystack.co",
          path: "/dedicated_account/assign",
          headers: {
            Authorization: process.env.SECRET_KEY,
            "Content-Type": "application/json",
          },
          maxRedirects: 20,
        };

        const req = https.request(options, function (res) {
          const chunks = [];

          res.on("data", function (chunk) {
            chunks.push(chunk);
          });

          res.on("end", function (chunk) {
            const body = Buffer.concat(chunks);
            console.log(body.toString());
          });

          res.on("error", function (error) {
            console.error(error);
          });
        });

        const postData = JSON.stringify({
          email: "janedoe@test.com",
          first_name: "Jane",
          middle_name: "Karen",
          last_name: "Doe",
          phone: "+2348100000000",
          preferred_bank: "test-bank",
          country: "NG",
          account_number: "0123456789",
          bvn: "20012345678",
          bank_code: "007",
        });
        const user = await User.create({});

        req.write(postData);

        req.end();

    } catch (error) {
        
    }
}
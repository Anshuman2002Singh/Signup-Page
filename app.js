const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();
app.use(express.static("public"));// to allow our local server to extract styles.css and logo.png from public folder
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});
app.post("/", function (req, res) {
    const firstname = req.body.fname;
    const email1 = req.body.email;
    const lastname = req.body.lname;
    const data = {
        members: [
            {
                email_address: email1,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname
                }


            }
        ]
    }
    const JSONDATA = JSON.stringify(data);                      //converting the data into JSON format
    const url = "https://us21.api.mailchimp.com/3.0/lists/4240694ced";        // Replace the audience id(4240694ced) with yours
    const options = {
        method: "POST",
        auth: "anshu:2af1acd3567b0d0ea30ed3936171a3a9-us21"                    // replace this with your own API KEY
    }
    const request = https.request(url, options, function (response) {               // For posting the data entered on our website to mailchimps server
        response.on("data", function (data) {
            if (response.statusCode == 200) {
                res.sendFile(__dirname + "/success.html");
            }
            else {
                res.sendFile(__dirname + "/failure.html");
            }
        })
    })
    request.write(JSONDATA);
    request.end();
});
app.post("/failure",function(req,res){                           // On a error it redirects to home page(signup.html)
    res.redirect("/");
});
app.listen(process.env.PORT || 3000, function () {                     // deploying our app locally as well as live on Heroku servers           
    console.log("SERVER IS UP AND RUNNING");              
});




//2af1acd3567b0d0ea30ed3936171a3a9-us21 - API KEY
// 4240694ced - Audience id(LIST ID)

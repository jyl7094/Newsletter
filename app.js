const express = require("express");
const app = express();
const port = process.env.PORT;

const https = require("https");

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
    const fName = req.body.fName;
    const lName = req.body.lName;
    const email = req.body.email;
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const url = process.env.URL;
    const options = {
        method: "POST",
        auth: process.env.AUTH
    };

    const request = https.request(url, options, (response) => {
        response.on("data", (data) => {
            console.log(JSON.parse(data));
            // console.log(JSON.parse(data).error_count);
            if (response.statusCode === 200 && JSON.parse(data).error_count === 0) {
                res.sendFile(__dirname + "/success.html");
            } else {
                res.sendFile(__dirname + "/failure.html");
            }
        });
    });

    app.post("/success", (req, res) => {
        res.redirect("/");
    });

    app.post("/failure", (req, res) => {
        res.redirect("/");
    });

    request.write(jsonData);
    request.end();
    // console.log(req.statusCode);
    // if (request.statusCode === 200) {
    //     res.sendFile(__dirname + "/success.html");
    // } else {
    //     res.sendFile(__dirname + "/failure.html");
    // }
});


app.listen(port || 3000, () => {
    console.log(`Server is running on port: ${port || 3000}`);
});

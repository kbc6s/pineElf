const express = require('express')
var app = express()
var request = require("request");


app.get("/", function (req, res) {
    res.send("hello world12345")
    options = {
        method: 'POST',
        url: 'https://notify-api.line.me/api/notify',
        headers: {
            Authorization: 'Bearer ohMIiD5N1vx7mlzlUWwb9EqcMY533cGBI6y8EPxbGOb',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            message: "\n" + '地點：黎明' + "\n" + "事件: 漏一筆資料"
        }
    };
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(body);
    });
})


app.listen(3001, function () {
    console.log('Listening on port 3001....')
})
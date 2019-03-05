var request = require("request");
const express = require('express')
var app = express()

var Token = "ohMIiD5N1vx7mlzlUWwb9EqcMY533cGBI6y8EPxbGOb"


//定時檢查資料

var myInt = setInterval(function () {
    var Leeming_sensor = {
        method: 'GET',
        url: 'https://kaiwen.azurewebsites.net/',
        // headers: {
        //     CK: 'DK4TSU4BPWTWWFW5EC'
        // }
    };
    request(Leeming_sensor, function (error, response, body) {
        if (error) throw new Error(error);
    });
}, 1200000);                              //3000是每三秒trigger一次

app.get("/HWC", function (req, res) {
    res.send("hello world333!!!!!")
})

app.listen(3001, function () {
    console.log('Listening on port 3001....')
})

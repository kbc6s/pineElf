var request = require("request");
const express = require('express')
var app = express()
var Token = "ohMIiD5N1vx7mlzlUWwb9EqcMY533cGBI6y8EPxbGOb"

//lineNotify function
var lineNotify = function (place,event){
    var options = {
        method: 'POST',
        url: 'https://notify-api.line.me/api/notify',
        headers: {
            Authorization: `Bearer ${Token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            message: "\n" + '地點：' + place + "\n" + "事件: " + event
        }
    };
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(body);
    });
}

//keep my azure awake

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
//HWC測試點
app.get("/openKai", function (req, res) {
    res.send("hello world333!!!!!")
    lineNotify("7697測試中","開！！！！")
})
app.get("/closeKai", function (req, res) {
    res.send("hello world333!!!!!")
    lineNotify("7697測試中","關")
})
app.listen(3001, function () {
    console.log('Listening on port 3001....')
})

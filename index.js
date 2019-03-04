//const Influx = require('influx')
var request = require("request");
const express = require('express')
var app = express()

var Token = "ohMIiD5N1vx7mlzlUWwb9EqcMY533cGBI6y8EPxbGOb"

//line 推播 function

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

//定時檢查資料

var myInt = setInterval(function () {
    var Leeming_sensor = {
        method: 'GET',
        url: 'http://kaiwen1995.com:3001/HWC',
        // headers: {
        //     CK: 'DK4TSU4BPWTWWFW5EC'
        // }
    };
    request(Leeming_sensor, function (error, response, body) {
        if (error) throw new Error(error);
    });
}, 3000);                              //3000是每三秒trigger一次
app.get("/kai", function (req, res) {
    res.send("hello world333!!!!!")
    //lineNotify("Leegood","開門！！！！！！！")
})
app.listen(3001, function () {
    console.log('Listening on port 3001....')
})

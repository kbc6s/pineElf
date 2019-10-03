//water Tower
var request = require("request");
const express = require('express')
var app = express()
var Token = "dDzOGwQdOB35Oru3VnaWJ3ssEJQFz9gfxtrWMbdNBmf"
var http = require('http')

var waterTower
var waterTower_last_data
var selectElf = 1     //選擇NB-iot模組
var controllElf = true //控制推撥開關

//lineNotify function
var lineNotify = function (place, event) {
    var options = {
        method: 'POST',
        url: 'https://notify-api.line.me/api/notify',
        headers: {
            Authorization: `Bearer ${Token}`,
            // 'Content-Type': 'application/x-www-form-urlencoded'
            'Content-Type': 'raw'
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

app.get("/closeKai", function (req, res) {
    res.send("message send")
    //console.log(req);
    if(controllElf){
    lineNotify("7697", "開門")
    }
})
app.get("/openKai", function (req, res) {
    res.send("已開啟")
    //console.log(req);
    lineNotify("7697", "關門")
    controllElf = true
})
// app.get("/stopElf", function (req, res) {
//     res.send("已關閉")
//     lineNotify("7697", "已暫停\n點擊連結開啟功能 \n http://18.214.142.82:3001/startElf")
//     controllElf = false
// })

app.listen(3001, function () {
    console.log('Listening on port 3001....')
})
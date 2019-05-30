//water Tower
var request = require("request");
const express = require('express')
var app = express()
var Token = "zOiTMF4ao65xlyLmztina81RmKsH2KZjPuv2vtvbpDN"
// var Token = "ohMIiD5N1vx7mlzlUWwb9EqcMY533cGBI6y8EPxbGOb"
var http = require('http')

var waterTower
var waterTower_last_data
var selectElf = 1     //選擇NB-iot模組
var controllElf = true //控制推撥開關


//JSON parse method
// var GetInflux = {
//     method: 'GET',
//     url: 'http://kaiwen1995.com:8086/query?db=lineBot;q=select * from lineBot where LineID=\'U8168367ec76c449dbdd98410d9333b8\'',
// };
// app.get("/", function (req, res) {
//     request(GetInflux, function (error, response, body) {
//         if (error) throw new Error(error);
//         // console.log(typeof(body))
//         var kaibuff = JSON.parse(body);

//          var stringResponse = JSON.stringify(kaibuff.results[0].series[0].values[0][3])
//         // var stringResponse = JSON.stringify(kaibuff.results[0])
//         res.send(kaibuff);

//         console.log(stringResponse);

//     })
// })
//          ==============Leegood Parse webAccess==================    
// var options = { method: 'POST',
//   url: 'http://192.168.3.69/WaWebService/Json/GetTagValue/Leegood',
//   headers: 
//    { Authorization: 'Basic YWRtaW46bGVlZ29vZA==',
//      'Content-Type': 'application/json' },
//   body: { Tags: [ { Name: 'DO1' } ] },
//   json: true };

// request(options, function (error, response, body) {
//   if (error) throw new Error(error);

//   //console.log(body);
//   //var qqq = JSON.parse(body);
//   var qqq = body;
//    console.log(qqq.Values[0].Value);

//   var int = 1;
// });
var myInt = setInterval(function () {
    var waterTower_value = {
        method: 'GET',
        url: 'https://iot.cht.com.tw/iot/v1/device/7608441860/sensor/elf'+ selectElf +'/rawdata',
        headers: {
            CK: 'DK4TSU4BPWTWWFW5EC'
        }
    };

    var position;
    request(waterTower_value, function (error, response, body) {
        if (error) throw new Error(error);
        waterTower = JSON.parse(body);
        position = waterTower.value[0];
        if (position > 1000 && controllElf) {
            lineNotify("水塔水位", "低線警報！！！")
        }
        if (waterTower.time != waterTower_last_data) {
            waterTower_last_data = waterTower.time;
            //console.log(LM_last_data)
        } else if(controllElf){
            lineNotify("7697", "當機了！！")
        }
    })
}, 180000);

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

app.get("/check", function (req, res) {
    res.send("message send")
    //console.log(req);
    if(controllElf){
    lineNotify("7697", "測試")
    }
})
app.get("/startElf", function (req, res) {
    res.send("已開啟")
    //console.log(req);
    lineNotify("7697", "開始監控\n 點擊連結關閉\n http://18.214.142.82:3001/startElf")
    controllElf = true
})
app.get("/stopElf", function (req, res) {
    res.send("已關閉")
    lineNotify("7697", "已暫停\n點擊連結開啟功能 \n http://18.214.142.82:3001/startElf")
    controllElf = false
})
app.get("/elf2", function(req, res){
    selectElf = 2
})
app.get("/elf1", function(req, res){
    selectElf = 1
})
//app.post()
app.listen(3001, function () {
    console.log('Listening on port 3001....')
})
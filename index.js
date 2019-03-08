const Influx = require('influx')
var request = require("request");
const express = require('express')
var app = express()
var request = require("request");

var LM_sensor_value
var LM_last_data
var MZ_sensor_value
var MZ_last_data

app.get("/", function (req, res) {
    res.send("hello world!!")
})

//設定influxdb
const influx = new Influx.InfluxDB({
    host: 'localhost',
    database: 'elfTest',
    schema: [{
        measurement: 'elf',
        fields: {
            HP: Influx.FieldType.INTEGER,
            SM: Influx.FieldType.INTEGER,
            T: Influx.FieldType.FLOAT,
            H: Influx.FieldType.FLOAT,
        },
        tags: [
            'place'
        ]
    }]
})

//line 推播
var lineNotify = function (place,event){
    var options = {
        method: 'POST',
        url: 'https://notify-api.line.me/api/notify',
        headers: {
            Authorization: 'Bearer ohMIiD5N1vx7mlzlUWwb9EqcMY533cGBI6y8EPxbGOb',
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
        url: 'https://iot.cht.com.tw/iot/v1/device/7608441860/sensor/elf1/rawdata',
        headers: {
            CK: 'DK4TSU4BPWTWWFW5EC'
        }
    };
    var promise1 = () => {
        return new Promise(function (resolve, reject) {
            request(Leeming_sensor, function (error, response, body) {
                if (error) throw new Error(error);
                LM_sensor_value = JSON.parse(body);
                resolve(JSON.parse(body));

                if (LM_sensor_value.time != LM_last_data) {
                    LM_last_data = LM_sensor_value.time;
                    console.log(LM_last_data)
                } else {
                   // lineNotify("黎明","漏一筆資料")
                }
            });
        });
    }

    promise1()
        .then(data => {
            influx.writePoints([{
                measurement: 'elf',
                tags: {
                    place: "Leeming"
                },
                fields: {
                    HP: LM_sensor_value.value[0],
                    SM: LM_sensor_value.value[1],
                    T: LM_sensor_value.value[2],
                    H: LM_sensor_value.value[3]
                }
            }])

        })

    //MZ
    var Mingchi_sensor = {
        method: 'GET',
        url: 'https://iot.cht.com.tw/iot/v1/device/7608441860/sensor/elf2/rawdata',
        headers: {
            CK: 'DK4TSU4BPWTWWFW5EC'
        }
    };
    var promise2 = () => {
        return new Promise(function (resolve, reject) {
            request(Mingchi_sensor, function (error, response, body) {
                if (error) throw new Error(error);
                MZ_sensor_value = JSON.parse(body);
                resolve(JSON.parse(body));
                if (MZ_sensor_value.time != MZ_last_data) {
                    MZ_last_data = MZ_sensor_value.time;
                    console.log(MZ_last_data)
                } else {
                    //lineNotify("明志","漏一筆資料")
                }
            });
        });
    }

    promise2()
        .then(data => {
            influx.writePoints([{
                measurement: 'elf',
                tags: {
                    place: "Mingchi"
                },
                fields: {
                    HP: MZ_sensor_value.value[0],
                    SM: MZ_sensor_value.value[1],
                    T: MZ_sensor_value.value[2],
                    H: MZ_sensor_value.value[3]
                }
            }])
        })
}, 1800000);

app.listen(3001, function () {
    console.log('Listening on port 3001....')
})

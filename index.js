const Influx = require('influx')
const express = require('express')
const http = require('http')
const os = require('os')
var request = require("request");
var app = express()

var LM_sensor_value
var LM_last_data
var MZ_sensor_value
var MZ_last_data

app.get("/", function(req, res){
    res.send("hello world123")
    })

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
                var options = {
                    method: 'POST',
                    url: 'https://notify-api.line.me/api/notify',
                    headers: {
                        Authorization: 'Bearer aOQD5n2E2VE69Z5RPtOTdT12IiTnR5IFwX2sJIkUJuG',
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
            }
        });
    });
}

promise1()
.then(data => {
    //console.log('黎明:', sensor_value.value[1]);
    influx.writePoints([{
        measurement: 'elf',
        tags: {
            place: "Leeming"
        },
        fields: {
            HP:LM_sensor_value.value[0],
            SM:LM_sensor_value.value[1],
            T:LM_sensor_value.value[2],
            H:LM_sensor_value.value[3]
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
            // if (MZ_sensor_value.value[0]<300){
            //     var options = {
            //         method: 'POST',
            //         url: 'https://notify-api.line.me/api/notify',
            //         headers: {
            //             Authorization: 'Bearer ohMIiD5N1vx7mlzlUWwb9EqcMY533cGBI6y8EPxbGOb',
            //             'Content-Type': 'application/x-www-form-urlencoded'
            //         },
            //         form: {
            //             message: "\n" + '地點：明志' + "\n" + "事件: 資料異常"
            //         }
            //     };
            //     request(options, function (error, response, body) {
            //         if (error) throw new Error(error);
            //         console.log(body);
            //     });
            // }
            if (MZ_sensor_value.time != MZ_last_data) {
                MZ_last_data = MZ_sensor_value.time;
                console.log(MZ_last_data)
            } else {
                var options = {
                    method: 'POST',
                    url: 'https://notify-api.line.me/api/notify',
                    headers: {
                        Authorization: 'Bearer ohMIiD5N1vx7mlzlUWwb9EqcMY533cGBI6y8EPxbGOb',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    form: {
                        message: "\n" + '地點：明志' + "\n" + "事件: 漏一筆資料"
                    }
                };
                request(options, function (error, response, body) {
                    if (error) throw new Error(error);
                    console.log(body);
                });
            }
        });
    });
}

promise2()
.then(data => {
    //console.log('黎明:', sensor_value.value[1]);
    influx.writePoints([{
        measurement: 'elf',
        tags: {
            place: "Mingchi"
        },
        fields: {
            HP:MZ_sensor_value.value[0],
            SM:MZ_sensor_value.value[1],
            T:MZ_sensor_value.value[2],
            H:MZ_sensor_value.value[3]
        }
    }])

})
}, 1800000);


influx.getDatabaseNames()
    .then(names => {
        if (!names.includes('elfTest')) {
            return influx.createDatabase('elfTest')
        }
    })
    .then(() => {
        http.createServer(app).listen(3001, function () {
            console.log('Listening on port 3001')
        })
    })
    .catch(err => {
        console.error(`Error creating Influx database!`)
    })

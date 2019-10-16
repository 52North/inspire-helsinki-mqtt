var Weather = require('./owm-connection');
var MqttConnection = require('./mqtt-connection');
var config = require('./configuration.json');

var weatherConn = new Weather(config.city, config.owmAppId);
var latestWeather = null;

// initial retrieve
weatherConn.retrieve((err, data) => {
    if (err) {
        console.error(err);
    } else {
        console.log('Received latest weather ' + JSON.stringify(data));
        latestWeather = data;
    }
});

// cyclic retrieve every 5 minutes
setInterval(() => {
    weatherConn.retrieve((err, data) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Received latest weather ' + JSON.stringify(data));
            latestWeather = data;
        }
    });
}, 1000 * 60 * 5);

var mqttClients = [];

// connect to all hosts
config.mqttHosts.forEach(h => {
    var mc = new MqttConnection(h, config.topic);
    mc.connect();
    mqttClients.push(mc);
});

var randomize = (v) => {
    var sign = (Math.random() >= 0.5);
    return sign ? v + Math.random() / 66 : v - Math.random() / 100;
};

setInterval(() => {
    var w = {
    };

    if (latestWeather.main.temp) {
        w.temperature = randomize(latestWeather.main.temp).toFixed(2);
    }
    if (latestWeather.main.humidity) {
        w.humidity = latestWeather.main.humidity;
    }
    if (latestWeather.wind.speed) {
        w.windSpeed = Math.max(0, randomize(latestWeather.wind.speed)).toFixed(2);
    }
    if (latestWeather.wind.deg) {
        w.windDirection = Math.max(0, randomize(latestWeather.wind.deg)).toFixed(2);
    }
    if (latestWeather.rain['1h']) {
        w.precipitationHourly = latestWeather.rain['1h'];
    }

    var pl = {
        time: new Date().toISOString(),
        data: w
    };

    // send to all
    mqttClients.forEach(mc => {
        mc.sendPayload(pl);
    });
    
}, 5000);

setTimeout(() => {
    mosquitto.disconnect();
    hivemq.disconnect();
}, 1000 * 60 * 60);

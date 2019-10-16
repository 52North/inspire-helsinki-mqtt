var MqttConnection = require('./mqtt-connection');
var config = require('./configuration.json');

config.mqttHosts.forEach(h => {
    var mc = new MqttConnection(h, 'inspire-helsinki');
    mc.connect();
    mc.subscribe((data) => {
        console.log(h + ': ' + data.toString());
    });
});
var mqtt = require('mqtt')

class MqttConnection {
    constructor(host, topic) {
        this.host = host;
        this.topic = topic;
    }

    set host(h) {
        this._host = h;
    }

    get host() {
        return this._host;
    }

    set topic(t) {
        this._topic = t;
    }

    get topic() {
        return this._topic;
    }

    set client(c) {
        this._client = c;
    }

    get client() {
        return this._client;
    }

    set listener(l) {
        this._listener = l;
    }

    get listener() {
        return this._listener;
    }

    connect() {
        console.log('Connecting to host: ' + this.host);
        this.client = mqtt.connect(this.host)
        
        this.client.on('connect', () => {
            console.log('Connected to host: ' + this.host);
        })

        this.client.on('message', (topic, message) => {
            if (this.listener) {
                this.listener(message);
            }
            
        })
    }

    disconnect() {
        this.client.end();
    }

    sendPayload(json) {
        this.client.publish(this.topic, JSON.stringify(json));
    }

    subscribe(listener) {
        this.listener = listener;
        this.client.subscribe(this.topic, (err) => {
            if (err) {
                console.error(err);
            }
        })
    }
}

module.exports = MqttConnection;
var weather = require('openweather-apis');

class WeatherConnection {
    constructor(city, appId) {
        this.city = city;
        weather.setLang('en');
        weather.setUnits('metric');
        weather.setAPPID(appId);
    }

    get city() {
        return this._city;
    }

    set city(c) {
        this._city = c;
    }

    retrieve(cb) {
        weather.setCity(this.city);
        
        // get all the JSON file returned from server (rich of info)
        weather.getAllWeather(function (err, data) {
            if (err) {
                cb(err);
            } else {
                cb(null, data);
            }
        });
    }

}

module.exports = WeatherConnection;

